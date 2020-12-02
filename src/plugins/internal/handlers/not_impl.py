from src.plugins.handler import Handler
from src.core.utils import NodeHandleResult
from src.core.logger import loggers

class HandleThrow(Handler):
    def process(self):
        loggers.error_logger.error("AST_THROW is not impelmented")
        return NodeHandleResult()

class HandleBreak(Handler):
    def process(self):
        loggers.error_logger.error("AST_BREAK is not impelmented")
        return NodeHandleResult()
