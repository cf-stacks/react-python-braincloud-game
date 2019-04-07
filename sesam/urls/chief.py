from django.urls import path


from ..views import chief as views


app_name = 'chief'


urlpatterns = [
    path(route='', view=views.home, name='home'),
    path(route='pending/', view=views.quiz_pending, name='quiz-pending'),
    path(route='pending/<uuid:question_id>/', view=views.quiz_question_edit, name='quiz-question-edit'),
    path(route='statistics/', view=views.quiz_statistics, name='quiz-statistics'),
]
