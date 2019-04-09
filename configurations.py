class BaseCongig(object):
	'''
	Base config class
	'''
	ENV = ""
	DEBUG = True
	TESTING = False

class ProductionConfig(BaseCongig):
	"""
	Production specific config
	"""
	DEBUG = False

class DevelopmentConfig(BaseCongig):
	"""
	Development environment specific configuration
	"""
	DEBUG = True
	TESTING = True
