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

archivo_1 = 'perfil1.svg'
archivo_2 = 'perfil2.svg'
archivo_3 = 'perfil3.svg'
archivoXML= 'rutasEsquema.xml'

def prologo_svg(nombre):
    with open(nombre, 'w') as archivoKML:
        archivoKML.write('<?xml version="1.0" encoding="UTF-8" ?>\n')
        archivoKML.write('<svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="800px" height="400px" >\n')

def altimetria(archivoXML):
 try:
    arbol = ET.parse(archivoXML)
    raiz = arbol.getroot()
    ns = {'ns': 'http://www.uniovi.es'}
    rutas = raiz.findall('.//ns:ruta',ns)





    for i in range(0,len(rutas)):
        ruta = rutas[i]
        #altitud_inicial=ruta.find('.//ns:altitud',ns).text
        altitud_inicial=0
        d_inicial=40

        puntos=[('Inicio',altitud_inicial)]
        hitos_por_ruta = ruta.findall('.//ns:hito',ns)
        if i == 0:
            archivo_1 = open('perfil1.svg', 'a')
        elif i == 1:
            archivo_1 = open('perfil2.svg', 'a')
        elif i == 2:
            archivo_1 = open('perfil3.svg', 'a')

        for h in hitos_por_ruta:
            nombre= h.attrib.get('nombre')
            altitud = h.find('.//ns:altitud',ns).text
            distancia = h.find('./ns:distancia',ns).text
            puntos.append((nombre,altitud))

        puntos.append(("Final",0))

        ancho = 200 - d_inicial
        espacios = ancho - (len(puntos)-1)

        coordenadas= [(it*espacios+d_inicial,200-float(altitud))for it,(_,altitud) in enumerate (puntos)]
        coordenadas.append((coordenadas[-1][0],200-float(altitud_inicial)))
        coordenadas.append((d_inicial,200-float(altitud_inicial)))
        puntos_svg = " ".join(f"{x},{y}" for x,y in coordenadas)

        archivo_1.write(f'<polyline points="{puntos_svg}" style="fill:white;stroke:red;stroke-width:4" /> \n')

        d_inicial=0
        for(x,y), (nombre,_) in zip (coordenadas,puntos):
            archivo_1.write(f'<text x="{x+d_inicial}" y ="200"  style="writing-mode: tb; glyph-orientation-vertical: 0;">{nombre}</text>')

        archivo_1.write('</svg>')

        archivo_1.close()
 except IOError:
    print ('No se encuentra el archivo ', archivoXML)
    exit()
 except ET.ParseError:
    print("Error procesando en el archivo XML = ", archivoXML)
    exit()


def main():
    prologo_svg(archivo_1)
    prologo_svg(archivo_2)
    prologo_svg(archivo_3)
    altimetria('rutasEsquema.xml')

if __name__ == '__main__':
    main()
