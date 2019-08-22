import logging 
import re
import sty

class ColorFormatter(logging.Formatter):
    ATTENTION = 15
    def format(self, record):
        res = super(ColorFormatter, self).format(record)
        if record.levelno >= logging.ERROR:
            res = sty.fg.red + sty.ef.bold + res + sty.rs.all
        elif record.levelno == logging.WARNING:
            res = sty.fg.yellow + res + sty.rs.all
        elif record.levelno == ColorFormatter.ATTENTION:
            res = sty.fg.green + sty.ef.bold + res + sty.rs.all
        return res

class NoColorFormatter(logging.Formatter):
    def format(self, record):
        res = super(NoColorFormatter, self).format(record)
        res = re.sub(r'\x1b\[[0-9;]*[a-zA-Z]', '', res)
        return res

def create_logger(name, log_type="console", level=logging.DEBUG):
    """
    we can choose this is a file logger or a console logger
    for now, we hard set the log file name to be run_log.log

    Args:
        name: the name of the logger
        log_type: choose from file or console

    Return:
        the created logger
    """

    file_handler = logging.FileHandler(filename="run_log.log")
    file_handler.setFormatter(NoColorFormatter())
    stream_handler = logging.StreamHandler()
    stream_handler.setFormatter(ColorFormatter())

    logger = logging.getLogger(name)
    logger.setLevel(level)

    if log_type == "file":
        logger.addHandler(file_handler)
    elif log_type == "console":
        logger.addHandler(stream_handler)

    return logger
