import json
from urllib.request import urlopen

response = urlopen('http://datos.santander.es/api/rest/datasets/paradas_bus.json?items=3000')
data = json.load(response)

resources = data['resources']
new_data = {}

for item in resources:
  stop_id = int(item['ayto:numero'])
  stop_name = item['ayto:parada']
  latitude = float(item['wgs84_pos:lat'])
  longitude = float(item['wgs84_pos:long'])

  new_data[stop_id] = []
  new_data[stop_id].append(latitude)
  new_data[stop_id].append(longitude)

  stop_name = stop_name.replace(' S/N', '')
  stop_name = stop_name.replace(' s/n', '')
  stop_name = stop_name.replace(' sin numero', '')

  stop_name = stop_name.replace('( ', '(')
  stop_name = stop_name.replace(' )', ')')

  # Typos from the data
  stop_name = stop_name.replace('deValdecilla', 'de Valdecilla')
  stop_name = stop_name.replace('LLano', 'Llano')
  stop_name = stop_name.replace('LLuja', 'Lluja')
  stop_name = stop_name.replace('Castilla71', 'Castilla 71')
  stop_name = stop_name.replace('Einstein.14', 'Einstein 14')
  stop_name = stop_name.replace('Tetuan .', 'Tetuan')
  stop_name = stop_name.replace('Gloria144', 'Gloria 144')
  stop_name = stop_name.replace('Davila.', 'Davila')
  stop_name = stop_name.replace('Deporte .', 'Deporte')
  stop_name = stop_name.replace('Adarzo.48', 'Adarzo 48')
  stop_name = stop_name.replace('Camnino .', 'Camino')
  stop_name = stop_name.replace('Cossio.', 'Cossio')
  stop_name = stop_name.replace('vega lamera', 'Vega Lamera')
  stop_name = stop_name.strip()

  new_data[stop_id].append(stop_name)

new_data[0] = []
new_data[0].append(0)
new_data[0].append(0)
new_data[0].append('Parada de test')

new_data = json.dumps(new_data, separators=(',', ':'))

file1 = open('../../../tusestimaciones-web/src/json/stops.min.json', 'w+')
file1.write(new_data)
file1.close()