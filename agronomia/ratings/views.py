# -*- coding: utf-8 -*-

from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse
from django.shortcuts import render
import json
from django.core import serializers # ok

from ratings.models import *

def cargarPaginaPrincipal(request):
	return render(request, "principal.html", {})

def cargarMaterias(request):
	materias = Materia.objects.all()
	materias_json = serializers.serialize('json', materias, fields = ('nombre'))
	profesores = Profesor.objects.filter(materia_id = 1)
	print serializers.serialize('json', profesores)

	return HttpResponse(materias_json, mimetype='application/javascript')

def cargarProfesores(request):
	profesores = Profesor.objects.all()
	profesores_json = serializers.serialize('json', profesores)

	return HttpResponse(profesores_json, mimetype='application/javascript')

def cargarComentariosDeProfesor(request):
	if request.method == 'GET':
		profesor_id = request.GET['profesor_id']

		comentarios = Comentario.objects.filter(profesor_id = profesor_id)
		comentarios_json = serializers.serialize('json', comentarios)
		print comentarios_json

		return HttpResponse(comentarios_json, mimetype='application/javascript')
	else:
		return HttpResponse('{"error": "true"}', mimetype='application/javascript')

@csrf_exempt
def crearComentario(request):
	if request.method == 'POST':
		comentario = Comentario()
		comentario.descripcion = request.POST['descripcion']
		comentario.anio_cursada = request.POST['anio_cursada']
		comentario.cuatrimestre_cursada = request.POST['cuatrimestre_cursada']
		comentario.profesor_id = request.POST['profesor']
		rating = Rating.objects.get(descripcion=request.POST['rating'].capitalize())
		comentario.rating = rating
		comentario.save()
		comentario_json = serializers.serialize('json', [comentario])
		return HttpResponse(comentario_json, mimetype='application/javascript')
	else:
		return HttpResponse('{"error": "true"}', mimetype='application/javascript')