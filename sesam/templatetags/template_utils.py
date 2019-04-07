from django import template

register = template.Library()

# from django.template.defaulttags import register


@register.simple_tag()
def get_statistic(dictionary, key):
    stats = dictionary.get(key, [])
    stats = (str(x) for x in stats)
    return ' / '.join(stats)
