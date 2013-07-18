# -*- coding: utf-8 -*-

from django.db import models

class Carrera(models.Model):
	nombre = models.CharField(max_length=100)

	class Meta:
		db_table = 'carrera'

	def __unicode__(self):
		return self.nombre

class Materia(models.Model):
	nombre = models.CharField(max_length=100)
	compartida = models.BooleanField()
	cuatrimestre = models.CharField(max_length=2)
	introduccion = models.TextField(max_length=300)
	carrera = models.ForeignKey('Carrera')
	anio_carrera = models.CharField(max_length = 1)

	class Meta:
		db_table = 'materia'	

	def __unicode__(self):
		return self.nombre	

class Correlativa(models.Model):
	materia = models.ForeignKey('Materia', related_name = 'materia')
	correlativa = models.OneToOneField('Materia')

	def __unicode__(self):
		return self.correlativa.nombre

	class Meta:
		db_table = 'correlativa'		

class Profesor(models.Model):
	nombre = models.CharField(max_length = 40)
	apellido = models.CharField(max_length = 40)
	materia = models.ForeignKey('Materia')

	def __unicode__(self):
		return self.nombre + ' ' + self.apellido

	class Meta:
		db_table = 'profesor'		

class RatingProfesor(models.Model):
	profesor = models.ForeignKey('Profesor')
	rating = models.ForeignKey('Rating')
	cantidad = models.IntegerField()

	def __unicode__(self):
		return self.rating.nombre + ': ' + cantidad

	class Meta:
		db_table = 'rating_profesor'		

class Comentario(models.Model):
	descripcion = models.TextField(max_length = 300)
	anio_cursada = models.CharField(max_length = 4)
	cuatrimestre_cursada = models.CharField(max_length = 2)
	created_at = models.DateTimeField(auto_now_add = True)
	updated_at = models.DateTimeField(auto_now = True)
	profesor = models.ForeignKey('Profesor')
	rating = models.ForeignKey('Rating')

	def __unicode__(self):
		return self.descripcion

	class Meta:
		db_table = 'comentario'			

class Rating(models.Model):
	descripcion = models.CharField(max_length=30)

	def __unicode__(self):
		return self.descripcion	

	class Meta:
		db_table = 'rating'
