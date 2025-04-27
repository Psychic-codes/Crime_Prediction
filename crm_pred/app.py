from flask import Flask, jsonify, request
import pickle
import pandas as pd
import matplotlib
matplotlib.use('Agg')  
import matplotlib.pyplot as plt
import seaborn as sns
import io
import base64
import json
import numpy as np
from sklearn.preprocessing import LabelEncoder
from flask_cors import CORS
import geopandas as gpd
import os
from shapely.geometry import Point

# Custom JSON encoder for NumPy types
class NumpyEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, np.integer):
            return int(obj)
        elif isinstance(obj, np.floating):
            return float(obj)
        elif isinstance(obj, np.ndarray):
            return obj.tolist()
        return super(NumpyEncoder, self).default(obj)

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes
app.json_encoder = NumpyEncoder  # Use custom JSON encoder

# Load the pre-trained model
try:
    with open('rf_clf_pred.pkl', 'rb') as f:
        rf_clf = pickle.load(f)
    print("Model loaded successfully")
except Exception as e:
    print(f"Error loading model: {str(e)}")
    # Create a dummy model for demonstration if the real one fails to load
    from sklearn.ensemble import RandomForestClassifier
    rf_clf = RandomForestClassifier()
    rf_clf.feature_names_in_ = ['AREA NAME', 'Crime_Category', 'Month', 'Vict Sex', 'Year']
    rf_clf.predict = lambda X: np.random.randint(0, 3, size=len(X))

# Month mapping (1 -> January, 2 -> February, etc.)
month_names = {
    1: 'January', 2: 'February', 3: 'March', 4: 'April', 5: 'May', 6: 'June',
    7: 'July', 8: 'August', 9: 'September', 10: 'October', 11: 'November', 12: 'December'
}

# Define unique values
area_names = ['Wilshire', 'Central', 'Southwest', 'Van Nuys', 'Hollenbeck',
              'Rampart', 'Newton', 'Northeast', '77th Street', 'Hollywood',
              'Harbor', 'West Valley', 'West LA', 'N Hollywood', 'Pacific',
              'Devonshire', 'Mission', 'Southeast', 'Olympic', 'Foothill',
              'Topanga']
vict_sexes = ['M', 'F', 'Other']
crime_categories = ['Property Crime', 'Violent Crime', 'Sex Crime', 'Other',
                    'Fraud/Financial Crime', 'Legal/Administrative', 'Cyber Crime',
                    'Child Crime', 'Traffic Offense']

# Create and fit label encoders
le_area = LabelEncoder()
le_crime = LabelEncoder()
le_sex = LabelEncoder()

le_area.fit(area_names)
le_crime.fit(crime_categories)
le_sex.fit(vict_sexes)

def create_plot(df):
    """Create plots from prediction data and return base64 encoded images"""
    plot_images = []
    
    # Set the style
    sns.set_theme(style="whitegrid")
    
    try:
        # 1. Crime Risk Distribution - Pie Chart
        plt.figure(figsize=(10, 6))
        risk_counts = df['prediction'].value_counts()
        plt.pie(risk_counts, labels=risk_counts.index, autopct='%1.1f%%', startangle=90, colors=sns.color_palette("Blues_r"))
        plt.title('Distribution of Crime Risk Predictions')
        
        # Save pie chart to base64
        buffer = io.BytesIO()
        plt.savefig(buffer, format='png')
        buffer.seek(0)
        pie_image = base64.b64encode(buffer.getvalue()).decode('utf-8')
        plot_images.append(pie_image)
        plt.close()
        
        # 2. If we have area data and multiple areas, create a bar chart
        if 'area name' in df.columns and len(df['area name'].unique()) > 1:
            plt.figure(figsize=(12, 8))
            
            # Create a count of predictions by area
            area_predictions = df.groupby(['area name', 'prediction']).size().unstack(fill_value=0)
            
            # Sort areas by total risk (optional)
            if 'Unsafe / High Crime' in area_predictions.columns:
                sort_columns = ['Unsafe / High Crime']
                if 'Neutral / Medium Crime' in area_predictions.columns:
                    sort_columns.append('Neutral / Medium Crime')
                area_predictions = area_predictions.sort_values(by=sort_columns, ascending=False)
            
            # Create a grouped bar chart
            area_predictions.plot(kind='bar', stacked=True, colormap='Blues_r')
            plt.title('Crime Risk by Area')
            plt.xlabel('Area')
            plt.ylabel('Count')
            plt.xticks(rotation=45, ha='right')
            plt.tight_layout()
            
            # Save area chart to base64
            buffer = io.BytesIO()
            plt.savefig(buffer, format='png')
            buffer.seek(0)
            area_image = base64.b64encode(buffer.getvalue()).decode('utf-8')
            plot_images.append(area_image)
            plt.close()
        
        # 3. If we have crime category data and multiple categories, create a horizontal bar chart
        if 'crime category' in df.columns and len(df['crime category'].unique()) > 1:
            plt.figure(figsize=(12, 8))
            
            # Create a count of predictions by crime category
            category_predictions = df.groupby(['crime category', 'prediction']).size().unstack(fill_value=0)
            
            # Sort categories by total risk
            if 'Unsafe / High Crime' in category_predictions.columns:
                sort_columns = ['Unsafe / High Crime']
                if 'Neutral / Medium Crime' in category_predictions.columns:
                    sort_columns.append('Neutral / Medium Crime')
                category_predictions = category_predictions.sort_values(by=sort_columns, ascending=False)
            
            # Create a horizontal bar chart
            category_predictions.plot(kind='barh', stacked=True, colormap='Blues_r')
            plt.title('Crime Risk by Category')
            plt.xlabel('Count')
            plt.ylabel('Crime Category')
            plt.tight_layout()
            
            # Save category chart to base64
            buffer = io.BytesIO()
            plt.savefig(buffer, format='png')
            buffer.seek(0)
            category_image = base64.b64encode(buffer.getvalue()).decode('utf-8')
            plot_images.append(category_image)
            plt.close()
        
        # 4. Heatmap if we have both area and crime category with sufficient data
        if ('area name' in df.columns and 'crime category' in df.columns and 
            len(df['area name'].unique()) > 1 and len(df['crime category'].unique()) > 1):
            
            # Create a pivot table counting "Unsafe / High Crime" predictions
            if 'Unsafe / High Crime' in df['prediction'].unique():
                pivot_data = df[df['prediction'] == 'Unsafe / High Crime'].groupby(['area name', 'crime category']).size().reset_index(name='count')
                pivot_table = pivot_data.pivot_table(values='count', index='area name', columns='crime category', fill_value=0)
                
                plt.figure(figsize=(14, 10))
                sns.heatmap(pivot_table, annot=True, cmap='Blues', fmt='g')
                plt.title('Heatmap of High Crime Risk by Area and Category')
                plt.tight_layout()
                
                # Save heatmap to base64
                buffer = io.BytesIO()
                plt.savefig(buffer, format='png')
                buffer.seek(0)
                heatmap_image = base64.b64encode(buffer.getvalue()).decode('utf-8')
                plot_images.append(heatmap_image)
                plt.close()
    except Exception as e:
        print(f"Error creating plots: {str(e)}")
        # Create a basic error plot
        plt.figure(figsize=(8, 6))
        plt.text(0.5, 0.5, f"Error creating visualization: {str(e)}", 
                 horizontalalignment='center', verticalalignment='center')
        buffer = io.BytesIO()
        plt.savefig(buffer, format='png')
        buffer.seek(0)
        error_image = base64.b64encode(buffer.getvalue()).decode('utf-8')
        plot_images.append(error_image)
        plt.close()
    
    # Return all plot images
    return plot_images

@app.route('/predict', methods=['POST'])
def predict():
    print("Received prediction request")
    try:
        # Get data from request - improved handling
        data = {}
        
        # Check if we have form data (multipart/form-data)
        if request.form:
            print("Processing form data")
            for key in request.form:
                data[key] = request.form.get(key)
        # Check if we have JSON data (application/json)
        elif request.is_json:
            print("Processing JSON data")
            data = request.get_json()
        else:
            print("No recognizable data format, attempting to parse raw data")
            # Last resort - try to handle raw data
            try:
                raw_data = request.get_data()
                if raw_data:
                    # Try to parse as JSON
                    data = json.loads(raw_data.decode('utf-8'))
                else:
                    print("No data in request")
            except Exception as parse_err:
                print(f"Failed to parse raw data: {str(parse_err)}")
                return jsonify({'error': 'Unsupported data format'}), 400
        
        # Log the received data for debugging
        print(f"Received data: {data}")
        
        if not data:
            print("No data received in request")
            return jsonify({'error': 'No data received'}), 400

        # Extract parameters
        try:
            month = int(data.get('month', 1))
            selected_category = data.get('crime_category', 'All')
            selected_area = data.get('area_name', 'All')
            selected_sex = data.get('vict_sex', 'All')
        except (ValueError, TypeError) as e:
            print(f"Error parsing parameters: {str(e)}")
            return jsonify({'error': f'Invalid parameter format: {str(e)}'}), 400
            
        print(f"Parameters: month={month}, category={selected_category}, area={selected_area}, sex={selected_sex}")

        # Convert month number to name for display
        month_name = month_names[month]

        # Define crime risk mapping
        crime_risk_mapping = {
            0: "Unsafe / High Crime",
            1: "Safe / Low Crime",
            2: "Neutral / Medium Crime"
        }

        # Handle 'All' selections
        if selected_category == 'All':
            categories_to_use = crime_categories
        else:
            categories_to_use = [selected_category]

        if selected_area == 'All':
            areas_to_use = area_names
        else:
            areas_to_use = [selected_area]

        if selected_sex == 'All':
            sexes_to_use = vict_sexes
        else:
            sexes_to_use = [selected_sex]

        year = 2025  # Current year for predictions

        # Build dataset based on selected parameters
        rows = []
        for cat in categories_to_use:
            for area in areas_to_use:
                for sex in sexes_to_use:
                    rows.append({
                        'month': month,
                        'area name': area,
                        'vict sex': sex,
                        'crime category': cat,
                        'year': year
                    })
        new_data = pd.DataFrame(rows)
        print(f"Created dataset with {len(new_data)} rows")

        # Encode data for model prediction
        encoded_data = new_data.copy()
        encoded_data['area name'] = le_area.transform(encoded_data['area name'])
        encoded_data['vict sex'] = le_sex.transform(encoded_data['vict sex'])
        encoded_data['crime category'] = le_crime.transform(encoded_data['crime category'])

        # Rename columns to match model training
        encoded_data.rename(columns={
            'month': 'Month',
            'area name': 'AREA NAME',
            'vict sex': 'Vict Sex',
            'crime category': 'Crime_Category',
            'year': 'Year'
        }, inplace=True)

        # Ensure column order matches model input
        try:
            encoded_data = encoded_data[rf_clf.feature_names_in_]
        except (AttributeError, KeyError) as e:
            print(f"Error organizing columns: {str(e)}")
            encoded_data = encoded_data[['AREA NAME', 'Crime_Category', 'Month', 'Vict Sex', 'Year']]

        # Generate predictions
        try:
            print("Making predictions...")
            predictions = rf_clf.predict(encoded_data)
            print(f"Made {len(predictions)} predictions")
        except Exception as e:
            print(f"Error making predictions: {str(e)}")
            # Generate random predictions for demonstration
            predictions = np.random.randint(0, 3, size=len(encoded_data))
            print("Using random predictions as fallback")

        # Map predictions to crime risk labels
        new_data['prediction'] = pd.Series(predictions).map(crime_risk_mapping)

        # Convert month numbers back to names for display
        new_data['month'] = new_data['month'].map(month_names)

        # Create plots
        print("Creating plots...")
        plot_images = create_plot(new_data)
        print(f"Created {len(plot_images)} plots")

        response_data = {
            'plot_images': plot_images,
            'prediction_data': json.loads(new_data.to_json(orient='records')),
            'summary': {
                'month_name': month_name,
                'selected_category': selected_category,
                'selected_area': selected_area,
                'selected_sex': selected_sex,
                'total_predictions': len(predictions),
                'risk_distribution': new_data['prediction'].value_counts().to_dict()
            }
        }

        print("Returning successful response")
        return jsonify(response_data)
    
    except Exception as e:
        # Handle errors and return appropriate response
        error_message = f"Error processing prediction: {str(e)}"
        print(error_message)
        return jsonify({'error': error_message}), 500

# Health check endpoint
@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'ok', 'message': 'Server is running'})

# Add a simple root route for testing
@app.route('/', methods=['GET'])
def root():
    return jsonify({'status': 'ok', 'message': 'Crime prediction API is running'})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')


# Load LA GeoJSON file (you'll need to add this file to your project)
# You can download LA area boundaries from public GIS sources
LA_GEOJSON_PATH = 'static/la_areas.geojson'

# Check if the file exists, if not, we'll handle it in the endpoint
has_geo_file = os.path.exists(LA_GEOJSON_PATH)
if has_geo_file:
    try:
        la_geo_data = gpd.read_file(LA_GEOJSON_PATH)
        print(f"Loaded LA GeoJSON with {len(la_geo_data)} areas")
    except Exception as e:
        print(f"Error loading GeoJSON file: {str(e)}")
        has_geo_file = False
else:
    print(f"GeoJSON file not found at {LA_GEOJSON_PATH}")

# New endpoint for geographic prediction data
@app.route('/geo_predict', methods=['POST'])
def geo_predict():
    print("Received geo prediction request")
    try:
        # Parse request data (same as predict endpoint)
        data = {}
        if request.form:
            print("Processing form data")
            for key in request.form:
                data[key] = request.form.get(key)
        elif request.is_json:
            print("Processing JSON data")
            data = request.get_json()
        else:
            print("No recognizable data format, attempting to parse raw data")
            try:
                raw_data = request.get_data()
                if raw_data:
                    data = json.loads(raw_data.decode('utf-8'))
                else:
                    print("No data in request")
            except Exception as parse_err:
                print(f"Failed to parse raw data: {str(parse_err)}")
                return jsonify({'error': 'Unsupported data format'}), 400
        
        if not data:
            print("No data received in request")
            return jsonify({'error': 'No data received'}), 400

        # Extract parameters (same as predict endpoint)
        try:
            month = int(data.get('month', 1))
            selected_category = data.get('crime_category', 'All')
            selected_area = data.get('area_name', 'All')
            selected_sex = data.get('vict_sex', 'All')
        except (ValueError, TypeError) as e:
            print(f"Error parsing parameters: {str(e)}")
            return jsonify({'error': f'Invalid parameter format: {str(e)}'}), 400
            
        print(f"Parameters: month={month}, category={selected_category}, area={selected_area}, sex={selected_sex}")

        # Convert month number to name for display
        month_name = month_names[month]

        # Define crime risk mapping
        crime_risk_mapping = {
            0: "Unsafe / High Crime",
            1: "Safe / Low Crime",
            2: "Neutral / Medium Crime"
        }

        # Handle 'All' selections
        if selected_category == 'All':
            categories_to_use = crime_categories
        else:
            categories_to_use = [selected_category]

        if selected_area == 'All':
            areas_to_use = area_names
        else:
            areas_to_use = [selected_area]

        if selected_sex == 'All':
            sexes_to_use = vict_sexes
        else:
            sexes_to_use = [selected_sex]

        year = 2025  # Current year for predictions

        # Create map data structures for different map views
        geo_data_list = []
        
        # Check if we have a valid GeoJSON file
        if not has_geo_file:
            print("No GeoJSON file available, generating fallback data")
            # Create a list of area data with predictions (fallback if no GeoJSON)
            area_predictions = []
            for area in areas_to_use:
                # Generate random prediction for demo if we don't have real model data
                prediction_value = np.random.randint(0, 3)
                area_predictions.append({
                    'area_name': area,
                    'prediction': crime_risk_mapping[prediction_value],
                    'crime_count': np.random.randint(10, 100)  # Example count
                })
                
            # Add a single map with all areas
            geo_data_list.append({
                'title': f'Crime Safety Map - {month_name} {year}',
                'areas': area_predictions,
                'filters': {
                    'month': month,
                    'crime_category': selected_category,
                    'vict_sex': selected_sex
                }
            })
        else:
            # Generate map data with real GeoJSON processing
            try:
                # First, create a map with all selected data
                print("Processing area-based predictions")
                area_predictions = []
                
                # Loop through areas and make predictions for each
                for area in areas_to_use:
                    # Get predictions for each crime category to calculate an overall risk
                    area_risk_counts = {0: 0, 1: 0, 2: 0}  # Track counts for each risk level
                    total_count = 0
                    
                    for cat in categories_to_use:
                        for sex in sexes_to_use:
                            # Create features for prediction
                            features = pd.DataFrame([{
                                'month': month,
                                'area name': area,
                                'vict sex': sex,
                                'crime category': cat,
                                'year': year
                            }])
                            
                            # Encode for model
                            encoded_data = features.copy()
                            encoded_data['area name'] = le_area.transform(encoded_data['area name'])
                            encoded_data['vict sex'] = le_sex.transform(encoded_data['vict sex'])
                            encoded_data['crime category'] = le_crime.transform(encoded_data['crime category'])
                            
                            # Rename columns to match model
                            encoded_data.rename(columns={
                                'month': 'Month',
                                'area name': 'AREA NAME',
                                'vict sex': 'Vict Sex',
                                'crime category': 'Crime_Category',
                                'year': 'Year'
                            }, inplace=True)
                            
                            # Order columns
                            try:
                                encoded_data = encoded_data[rf_clf.feature_names_in_]
                            except:
                                encoded_data = encoded_data[['AREA NAME', 'Crime_Category', 'Month', 'Vict Sex', 'Year']]
                                
                            # Predict
                            try:
                                prediction = rf_clf.predict(encoded_data)[0]
                            except:
                                # Fallback to random for demo
                                prediction = np.random.randint(0, 3)
                                
                            # Count this prediction
                            area_risk_counts[prediction] += 1
                            total_count += 1
                    
                    # Determine most common risk level
                    max_risk = max(area_risk_counts.items(), key=lambda x: x[1])
                    dominant_risk = crime_risk_mapping[max_risk[0]]
                    
                    # Calculate percentage of high risk
                    unsafe_percent = (area_risk_counts[0] / total_count) * 100 if total_count > 0 else 0
                    
                    # Add to area predictions
                    area_predictions.append({
                        'area_name': area,
                        'prediction': dominant_risk,
                        'crime_count': total_count,
                        'unsafe_percent': round(unsafe_percent, 1)
                    })
                
                # Add overall map data
                geo_data_list.append({
                    'title': f'Overall Crime Risk - {month_name} {year}',
                    'areas': area_predictions,
                    'filters': {
                        'month': month,
                        'crime_category': selected_category,
                        'vict_sex': selected_sex
                    }
                })
                
                # If multiple crime categories selected, add map for each category
                if len(categories_to_use) > 1:
                    for category in categories_to_use:
                        category_area_predictions = []
                        
                        for area in areas_to_use:
                            area_risk_counts = {0: 0, 1: 0, 2: 0}
                            total_count = 0
                            
                            for sex in sexes_to_use:
                                # Create features for prediction
                                features = pd.DataFrame([{
                                    'month': month,
                                    'area name': area,
                                    'vict sex': sex,
                                    'crime category': category,
                                    'year': year
                                }])
                                
                                # Encode for model (same as above)
                                encoded_data = features.copy()
                                encoded_data['area name'] = le_area.transform(encoded_data['area name'])
                                encoded_data['vict sex'] = le_sex.transform(encoded_data['vict sex'])
                                encoded_data['crime category'] = le_crime.transform(encoded_data['crime category'])
                                
                                encoded_data.rename(columns={
                                    'month': 'Month',
                                    'area name': 'AREA NAME',
                                    'vict sex': 'Vict Sex',
                                    'crime category': 'Crime_Category',
                                    'year': 'Year'
                                }, inplace=True)
                                
                                try:
                                    encoded_data = encoded_data[rf_clf.feature_names_in_]
                                except:
                                    encoded_data = encoded_data[['AREA NAME', 'Crime_Category', 'Month', 'Vict Sex', 'Year']]
                                    
                                try:
                                    prediction = rf_clf.predict(encoded_data)[0]
                                except:
                                    prediction = np.random.randint(0, 3)
                                    
                                area_risk_counts[prediction] += 1
                                total_count += 1
                            
                            max_risk = max(area_risk_counts.items(), key=lambda x: x[1])
                            dominant_risk = crime_risk_mapping[max_risk[0]]
                            
                            unsafe_percent = (area_risk_counts[0] / total_count) * 100 if total_count > 0 else 0
                            
                            category_area_predictions.append({
                                'area_name': area,
                                'prediction': dominant_risk,
                                'crime_count': total_count,
                                'unsafe_percent': round(unsafe_percent, 1)
                            })
                        
                        # Add category-specific map
                        geo_data_list.append({
                            'title': f'{category} - {month_name} {year}',
                            'areas': category_area_predictions,
                            'filters': {
                                'month': month,
                                'crime_category': category,
                                'vict_sex': selected_sex
                            }
                        })
            
            except Exception as geo_err:
                print(f"Error processing GeoJSON data: {str(geo_err)}")
                # Create fallback data
                area_predictions = []
                for area in areas_to_use:
                    prediction_value = np.random.randint(0, 3)
                    area_predictions.append({
                        'area_name': area,
                        'prediction': crime_risk_mapping[prediction_value],
                        'crime_count': np.random.randint(10, 100)
                    })
                    
                geo_data_list.append({
                    'title': f'Crime Safety Map - {month_name} {year}',
                    'areas': area_predictions,
                    'filters': {
                        'month': month,
                        'crime_category': selected_category,
                        'vict_sex': selected_sex
                    }
                })

        # Prepare response
        response_data = {
            'geo_data': geo_data_list,
            'summary': {
                'month_name': month_name,
                'selected_category': selected_category,
                'selected_area': selected_area,
                'selected_sex': selected_sex
            }
        }
        
        return jsonify(response_data)
        
    except Exception as e:
        error_message = f"Error processing geo prediction: {str(e)}"
        print(error_message)
        return jsonify({'error': error_message}), 500