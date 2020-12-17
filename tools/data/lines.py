import json
from urllib.request import urlopen

response = urlopen('http://datos.santander.es/api/rest/datasets/lineas_bus.json?items=3000')
data = json.load(response)

resources = data['resources']
new_data = []

for item in resources:
  line_label = item['ayto:numero']
  line_label = line_label.replace('99', 'LANZADERA')

  new_data.append(line_label)

new_data = json.dumps(new_data, separators=(',', ':'))

file1 = open('../../functions/src/json/lines.min.json', 'w+')
file1.write(new_data)
file1.close()
