from flask import Flask, send_file, request, make_response
from datetime import timedelta
import boto3, json
from functools import update_wrapper

app = Flask(__name__)

# @app.after_request
# def after_request(response):
#     response.headers.add('Access-Control-Allow-Headers', 'Content-Type-Authorization')
#     response.headers.add('Access-Control-Allow-Origin', '*')
#     response.headers.add('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE')
#     return response

@app.route("/")
def index():
    return send_file("templates/index.html")

@app.route("/keys", methods=["POST", "GET", "OPTIONS"])
def keys():
    # CORS setup
    if request.method == 'OPTIONS':
        response = make_response()
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Methods', 'GET, POST')
        return response

    if request.method == "POST":
        key = json.loads(request.data)

        client = boto3.client(
            'ec2',
            aws_access_key_id=key['public'],
            aws_secret_access_key=key['private'],
            region_name="us-east-2"
        )

        response_data = []

        return_data = client.describe_instances()
        reservations = return_data['Reservations']
        for reservation in reservations:
            instances = reservation['Instances']
            for instance in instances:
                data = {
                    "InstanceId": instance['InstanceId'],
                    "InstanceType": instance['InstanceType'],
                    "LaunchTime": str(instance['LaunchTime']),
                    "PublicIpAddress": instance['PublicIpAddress'],
                    "PrivateIpAddress": instance['PrivateIpAddress'],
                }
                response_data.append(data)

        response_data = json.dumps(response_data)

        response = make_response()
        response.headers.add("Content-Type", "application/json")
        response.data = response_data

        return response
    else:
        return "500"

if __name__ == "__main__":
    app.run(host='0.0.0.0', port="8000")
