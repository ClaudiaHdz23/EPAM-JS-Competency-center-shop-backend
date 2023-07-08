import boto3
import uuid

dynamodb = boto3.client('dynamodb')

products = [
    {
        'id': str(uuid.uuid4()),
        'title': 'Dell Laptop Gaming G3',
        'description': 'Dell Laptop Gaming G3',
        'price': 27.99
    },
    {
        'id': str(uuid.uuid4()),
        'title': 'Laptop HP 15.6',
        'description': 'Laptop HP 15.6',
        'price': 16.49
    },
    {
        'id': str(uuid.uuid4()),
        'title': 'LG Monitor 34',
        'description': 'LG Monitor 34',
        'price': 13.99
    },
    {
        'id': str(uuid.uuid4()),
        'title': 'HP Monitor 23.8',
        'description': 'HP Monitor 23.8',
        'price': 65.99
    },
    {
        'id': str(uuid.uuid4()),
        'title': 'Seagate, Disco Duro Portatil de 2TB',
        'description': 'Seagate, Disco Duro Portatil de 2TB',
        'price': 19.99,
    },
    {
        'id': str(uuid.uuid4()),
        'title': 'Seagate, Disco Duro de 8TB',
        'description': 'Seagate, Disco Duro de 8TB',
        'price': 48.99,
    }
]

stock = [
    {
        'product_id': products[0]['id'],
        'count': 1
    },
    {
        'product_id': products[1]['id'],
        'count': 6
    },
    {
        'product_id': products[2]['id'],
        'count': 10
    },
    {
        'product_id': products[3]['id'],
        'count': 4
    },
    {
        'product_id': products[4]['id'],
        'count': 15
    },
    {
        'product_id': products[5]['id'],
        'count': 8
    }
]

for product in products:
    dynamodb.put_item(
        TableName='products',
        Item={
            'id': {'S': product['id']},
            'title': {'S': product['title']},
            'description': {'S': product['description']},
            'price': {'N': str(product['price'])}
        }
    )

for item in stock:
    dynamodb.put_item(
        TableName='stock',
        Item={
            'product_id': {'S': item['product_id']},
            'count': {'N': str(item['count'])}
        }
    )

