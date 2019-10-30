signature_lists = {
        'os_command': [
            "sink_execFile_hqbpillvul",
            'sink_exec_hqbpillvul',
            'sink_execSync_hqbpillvul'
            ],
        'xss': [
            'createServer',
            'write',
            'send'
            ]
}

def get_all_sign_list():
    """
    return a list of all the signature functions
    """
    res = []
    for key in signature_lists:
        res += signature_lists[key]

    return res

