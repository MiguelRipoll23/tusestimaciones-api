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
  point = int(item['ayto:PuntoKM'])

  route_id = route_id.split('-');
  route_id = route_id[1] + route_id[2] + route_id[3]

  if line_label not in new_data:
    new_data[line_label] = {}

  if route_id not in new_data[line_label]:
    new_data[line_label][route_id] = []

  new_data[line_label][route_id].append([point, stop_id, stop_name])
  new_data[line_label][route_id].sort(key=lambda item: item[0])

# Remove order field
for line_label in new_data:
  line = new_data[line_label]

  for route_id in line:
    route = new_data[line_label][route_id]

    for stop in route:
      stop.pop(0)

new_data = json.dumps(new_data, separators=(',', ':'))

file1 = open('../../functions/src/json/routes-stops.min.json', 'w+')
file1.write(new_data)
file1.close()
