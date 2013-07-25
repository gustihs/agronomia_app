var profesores = {};

$(function(){

	cargarProfesores();

	function cargarProfesores(){

		$.ajax({
			type: 'get',
			dataType: 'json',
			url: '/profesores',
			data: '',
			success: function(rta_profesores){
				profesores = rta_profesores;
				cargarMaterias();
			},
			error: function(){

			}
		});

	}

	function getProfesoresPorMateria(materia_id){

		var resultados = [];
		$(profesores).each(function(){
			var profesor = this;
			if(profesor.fields.materia == materia_id){
				resultados.push(profesor);
			}
		});

		return resultados;

	}

	function cargarMaterias(){

		$.ajax({
			type: 'get',
			dataType: 'json',
			url: '/materias',
			data: '',
			success: function(materias){
				var accordion = $('#materias');
				$(materias).each(function(){
					var materia = new MateriaView();
					accordion.append(materia.render('materias', this));
					var profesorNuevo = new ProfesorView();
					profesorNuevo.cargarEventosFormProfesorNuevo($('#profesor_nuevo_accordion_body'));
					var profesores_ = getProfesoresPorMateria(this.pk);
					materia.agregarProfesoresAMateria(profesores_, this.pk);
				});

				cargarComentarios();

				$('#materias').on('show', function(){
					$('#materias > .accordion-body.in').collapse('hide');					
				});				

				$('#materias').on('show', function(){
					$('#materias > .accordion-body.in').css('height', screen.height);					
				});				

				$('#materias').on('hidden', function(){
					$('#materias > .accordion-inner').find('.comentarios, .comentario_nuevo').remove();
				});
			},
			error: function(){

			}
		});
	}

	function cargarComentarios(){

		$('#materias .profesores a.accordion-toggle').on('click', function(){			
			$(this).toggleClass('activo');
			var profesor_id = $(this).attr('pk');
			var materia_id = $(this).data('parent').split("_")[1];

			$.ajax({
				type: 'get',
				dataType: 'json',
				url: '/comentarios',
				data: {'profesor_id': profesor_id },
				beforeSend: function(){
					$('#materia_' + materia_id + ' .accordion-inner').first().find('.comentarios, .comentario_nuevo').remove();
					var comentarioNuevo = new ComentarioView();
					var html = comentarioNuevo.renderComentarioNuevo(materia_id);
					html += '<div id="comentarios_'+materia_id+'" class="comentarios">';					
					$('#materia_' + materia_id + ' .accordion-inner').first().append(html);
					var img = '<img src="/static/img/loading.gif" />';
					$('#comentarios_' + materia_id).html('').append(img);

					comentarioNuevo.cargarAniosCursada();
					comentarioNuevo.cargarCuatrimestres();

					$('.comentario_nuevo input[name=rating]').on('click', function(){
						$('.comentario_nuevo input[name=rating]').parent().removeClass('activa');
						$(this).parent().addClass('activa');
					});

					$('.comentario_nuevo form button').on('click', function(e){
						e.preventDefault();
						
						var form = $(this).parent();
						form.find('input[name=profesor]').val(profesor_id);
						var huboError = false;

						comentarioObject = {};
						comentarioObject.descripcion = form.find('textarea[name=descripcion]').val();
						comentarioObject.anio_cursada = form.find('select[name=anio_cursada]').val();
						comentarioObject.cuatrimestre_cursada = form.find('select[name=cuatrimestre_cursada]').val();
						comentarioObject.rating = form.find('input[name=rating]:checked').val();
						comentarioObject.profesor = profesor_id;						

						if(comentarioObject.descripcion == ''){
							alertify.error("Rellena el comentario");
							huboError = true;
						}

						if(comentarioObject.anio_cursada == ''){
							alertify.error("Completa el año de cursada");
							huboError = true;
						}

						if(comentarioObject.cuatrimestre_cursada == ''){
							alertify.error("Completa el cuatrimestre que cursaste");
							huboError = true;
						}
						
						if(typeof(comentarioObject.rating) == 'undefined'){
							alertify.error("Por favor selecciona la carita que mejor identifique tu cursada");
							huboError = true;
						}												

						if(huboError) return false;

						$.ajax({
							url: '/comentario_nuevo',
							dataType: 'json',
							data: comentarioObject,
							type: 'post',
							success: function(comentario){
								var comentarioView = new ComentarioView();
								comentario = comentarioView.render(comentario[0]);
								var comentarios = $('#comentarios_' + materia_id);								
								comentarios.html(comentarios.html() + comentario);
							}
						});
					});
				},
				success: function(comentarios_){
					
					var html = '';
					$(comentarios_).each(function(){
						console.log("aca");
						var comentarioView = new ComentarioView();
						html += comentarioView.render(this);
					});

					$('#comentarios_' + materia_id).html('').append(html);
				},
				error: function(){

				}
			});				
		});	
	}

	MateriaView = Backbone.View.extend({

		initialize: function(){

		},
		render: function(accordion, materia){

			var html = '<div class="accordion-group">';
			html += '<div class="accordion-heading">';
			html += '<a pk="'+materia.pk+'" class="accordion-toggle" data-toggle="collapse" data-parent="'+accordion+'" href="#materia_'+materia.pk+'">';
			html += materia.fields.nombre
			html += '</a></div>';
			html += this.cargarContenidoAcordion(materia);
			html += '</div>';

			return html;

		},
		cargarContenidoAcordion: function(materia){
			var html = '<div id="materia_'+materia.pk+'" class="accordion-body collapse">';
			html += '<div class="accordion-inner">';
			html += '<div id="profesores_'+materia.pk+'" class="profesores accordion">';
			html += '</div>';
			html += '</div>';
			html += '</div>';

			return html;
		},
		agregarProfesoresAMateria: function(profesores_, materia_id){

			var html = '';
			$(profesores_).each(function(){
				var profesorView = new ProfesorView();
				html += profesorView.render(this);
			});
			var profesorView = new ProfesorView();
			html += profesorView.renderFormProfesorNuevo(materia_id);

			var accordion = 'profesores_' + materia_id;
			$('#' + accordion).append(html);
			$('#' + accordion + ' a').first().addClass('activo');
		}
	});

	ProfesorView = Backbone.View.extend({

		initialize: function(){

		},
		render: function(profesor){

			var html = '<div class="accordion-group">';
			html += '<div class="accordion-heading">';
			html += '<a pk="'+profesor.pk+'" class="accordion-toggle" data-toggle="collapse" data-parent="profesores_'+profesor.fields.materia+'" href="#profesor_'+profesor.pk+'">';
			html += profesor.fields.nombre			
			html += '</a></div>';
			html += '</div>';

			return html;

		},
		renderFormProfesorNuevo: function(materia_id){
			var data = { materia_id: materia_id };
			var html = _.template($('#template_form_profesor_nuevo').html(), data);
			return html;
		},
		cargarEventosFormProfesorNuevo: function(form){
			
			$(form).find('input').typeahead({
				name: 'accounts',
			  	local: ['timtrueman', 'JakeHarding', 'vskarich']
			});
		}
	});	

	ComentarioView = Backbone.View.extend({
		initialize: function(){

		},
		render: function(comentario){
			var ratings = ['feliz', 'neutral', 'triste'];
			var fecha = comentario.fields.updated_at.substr(0, 10);
			var variables = { 
				'fecha': fecha, 
				'anio_cursada' : comentario.fields.anio_cursada,
				'cuatrimestre_cursada': comentario.fields.cuatrimestre_cursada,
				'descripcion': comentario.fields.descripcion,
				'rating': ratings[comentario.fields.rating - 1]
			};
			var html = _.template($('#template_comentario').html(), variables);
			return html;
		},
		renderComentarioNuevo: function(materia_id){
			var profesor = $('#profesores_' + materia_id + ' a.activo');
			var profesor_id = profesor.attr('pk');
			var nombre = profesor.html();
			var variables = { 'materia_id': materia_id, 'nombre_profesor': nombre };
			var html = _.template($('#template_form_comentario_nuevo').html(), variables);

			return html;
		},
		cargarAniosCursada: function(){
			var anios = $('.comentario_nuevo form select[name=anio_cursada]');
			var anios_html = '';
			var fecha_actual = new Date();
			var anio_actual = fecha_actual.getFullYear();

			for(var indice = 0; indice < 6; indice++){
				var anio = anio_actual - indice;
				anios_html += '<option value="' + anio + '">' + anio + '</option>';
			}

			anios.html(anios_html);
		},
		cargarCuatrimestres: function(){
			var cuatrimestres = $('.comentario_nuevo form select[name=cuatrimestre_cursada]');
			var cuatrimestres_html = '';
			var opciones = ['1C', '2C', '1B', '2B', '3B', '4B', 'A'];		

			for(var indice = 0; indice < opciones.length; indice++){
				var opcion = opciones[indice];
				cuatrimestres_html += '<option value="' + opcion + '">' + opcion + '</option>';
			}

			cuatrimestres.html(cuatrimestres_html);			
		}
	});

});

// <div id="collapseOne" class="accordion-body collapse in">
// 	<div class="accordion-inner">
// 		Anim pariatur cliche...
// 	</div>
// </div>