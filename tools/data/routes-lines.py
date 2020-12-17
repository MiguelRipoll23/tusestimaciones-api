import json
from urllib.request import urlopen

response = urlopen('http://datos.santander.es/api/rest/datasets/lineas_bus_secuencia.json?items=3000')
data = json.load(response)

resources = data['resources']
new_data = {}

for item in resources:
  line_label = item['dc:EtiquetaLinea']
  stop_id = int(item['ayto:NParada'])
  stop_name = item['ayto:NombreParada']
  route_id = item['dc:identifier']

  route_id = route_id.split('-');
  route_id = route_id[1] + route_id[2] + route_id[3]

  if stop_id not in new_data:
    new_data[stop_id] = {}

  if line_label not in new_data[stop_id]:
    new_data[stop_id][line_label] = []

  new_data[stop_id][line_label] = route_id

new_data = json.dumps(new_data, separators=(',', ':'))

file1 = open('../../functions/src/json/routes-lines.min.json', 'w+')
file1.write(new_data)
file1.close()
