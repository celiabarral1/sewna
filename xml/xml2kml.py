#-------------------------------------------------------------------------------
# Name:        módulo1
# Purpose:
#
# Author:      Celia
#
# Created:     10/12/2023
# Copyright:   (c) Celia 2023
# Licence:     <your licence>
#-------------------------------------------------------------------------------

import xml.etree.ElementTree as ET

archivo_1 = 'ruta1.kml'
archivo_2 = 'ruta2.kml'
archivo_3 = 'ruta3.kml'
archivoXML= 'rutasEsquema.xml'

def prologo_kml(nombre,nombre_ruta,descripcion):
    with open(nombre, 'w') as archivoKML:
        archivoKML.write('<?xml version="1.0" encoding="UTF-8"?>\n')
        archivoKML.write('<kml xmlns="http://www.opengis.net/kml/2.2">\n')
        archivoKML.write('<Document id="Universidad de Oviedo">\n')
        archivoKML.write('<Placemark>\n')
        archivoKML.write(f'<name>{nombre_ruta}</name>\n')
        archivoKML.write(f'<description>{descripcion}</description>\n')
        archivoKML.write('<Point>\n')


def epilogo_kml(nombre):
    with open(nombre, 'a') as archivoKML:
        archivoKML.write('<altitudeMode>relativeToGround</altitudeMode>\n')
        archivoKML.write('</Point>\n')
        archivoKML.write('</Placemark>\n')
        archivoKML.write('</Document>\n')
        archivoKML.write('</kml>\n')


def escribir_coordenadas(archivoXML,raiz,ns):

 rutas = raiz.findall('.//ns:ruta/ns:coordenadas',ns)

 with open('ruta1.kml', 'a') as archivo_1, \
        open('ruta2.kml', 'a') as archivo_2, \
        open('ruta3.kml', 'a') as archivo_3:

             archivo_1.write('<coordinates> \n')
             archivo_2.write('<coordinates> \n')
             archivo_3.write('<coordinates> \n')

             for i in range(0,len(rutas)):
                ruta = rutas[i]
                longitud = ruta.find('.//ns:longitud',ns).text
                latitud = ruta.find('.//ns:latitud',ns).text
                altitud = ruta.find('.//ns:altitud',ns).text

                if i == 0:
                    archivo_1.write(f'{latitud},{longitud}\n')
                elif i == 1:
                    archivo_2.write(f'{latitud},{longitud}\n')
                elif i == 2:
                    archivo_3.write(f'{latitud},{longitud}\n')


             archivo_1.write('</coordinates> \n')
             archivo_2.write('</coordinates> \n')
             archivo_3.write('</coordinates> \n')


def main():
    try:
        arbol = ET.parse(archivoXML)
        raiz = arbol.getroot()
        ns = {'ns': 'http://www.uniovi.es'}
        rutas = raiz.findall('.//ns:ruta',ns)

        descripciones = raiz.findall('.//ns:ruta/ns:descripcion', ns)

        prologo_kml(archivo_1,rutas[0].attrib.get('nombre'),descripciones[0].text)
        prologo_kml(archivo_2,rutas[1].attrib.get('nombre'),descripciones[1].text)
        prologo_kml(archivo_3,rutas[2].attrib.get('nombre'),descripciones[2].text)

        escribir_coordenadas(archivoXML,raiz,ns)

        epilogo_kml(archivo_1)
        epilogo_kml(archivo_2)
        epilogo_kml(archivo_3)

    except IOError:
         print ('No se encuentra el archivo ', archivoXML)
         exit()
    except ET.ParseError:
        print("Error procesando en el archivo XML = ", archivoXML)
        exit()


if __name__ == "__main__":
 main()