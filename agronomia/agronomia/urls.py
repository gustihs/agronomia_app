from django.conf.urls import patterns, include, url
from ratings.views import *

# -*- coding: utf-8 -*-

# Uncomment the next two lines to enable the admin:
from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'agronomia.views.home', name='home'),
    # url(r'^agronomia/', include('agronomia.foo.urls')),

    # Uncomment the admin/doc line below to enable admin documentation:
    # url(r'^admin/doc/', include('django.contrib.admindocs.urls')),

    # Uncomment the next line to enable the admin:
    url(r'^admin/', include(admin.site.urls)),

   	url(r'^principal', cargarPaginaPrincipal),
   	url(r'^materias', cargarMaterias),
   	url(r'^profesores', cargarProfesores),
   	url(r'^comentarios', cargarComentariosDeProfesor),
    url(r'^comentario_nuevo', crearComentario),
    
)
