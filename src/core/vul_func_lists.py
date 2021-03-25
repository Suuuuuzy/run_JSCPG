signature_lists = {
        'os_command': [
            'eval',
            "sink_hqbpillvul_execFile",
            'sink_hqbpillvul_exec',
            'sink_hqbpillvul_execSync',
            'sink_hqbpillvul_spawn',
            'sink_hqbpillvul_spawnSync'
            ],
        'xss': [
            'sink_hqbpillvul_http_write',
            'sink_hqbpillvul_http_setHeader'
            ],
        'proto_pollution': [
            'merge', 'extend', 'clone', 'parse'
            ],
        'code_exec': [
            'Function',
            'eval',
            "sink_hqbpillvul_execFile",
            'sink_hqbpillvul_exec',
            'sink_hqbpillvul_execSync',
            'sink_hqbpillvul_eval'
            ],
        'sanitation': [
            'parseInt'
            ],
        'path_traversal': [
            'pipe',
            'sink_hqbpillvul_http_write',
            'sink_hqbpillvul_http_sendFile',
            ],
        'depd': [
            'sink_hqbpillvul_pp',
            'sink_hqbpillvul_code_execution',
            'sink_hqbpillvul_exec'
            ],
        'chrome_data_exfiltration':[
            'postMessage'
        ],
        'chrome_API_execution':[
            'postMessage'
        ]
}

crx_source_var_name = ['mostVisitedUrls_source',
                       'cookie_source',
                       'cookies_source',
                       'CookieStore_source',
                       'CookieStores_source',
                       'storage_sync_get_source',
                       'storage_local_get_source',

                       ]

crx_source = [
        # chrome extension built-in get sensitive data APIs
        'chrome_topSites_get_source',
        'chrome_cookies_get_source',
        'chrome_cookies_getAll_source',
        'chrome_cookies_getAllCookieStores_source',
        # 'chrome_cookies_onChanged_addListener_source'
        'chrome_storage_sync_get_source',
        'chrome_storage_local_get_source'
        'chrome_history_search_source',
        'chrome_history_getVisits_source',
        'chrome_downloads_search_souece',
        'chrome_downloads_getFileIcon_source'
        # jQuery source
        'jQuery_get_source',
        'jQuery_post_source'
]

crx_sink = [
        # jQuery sinks
        'jQuery_get_url_sink',
        'jQuery_post_data_sink',
        'jQuery_post_url_sink',
        # crx sinks
        'chrome_tabs_executeScript_sink',
        'chrome_cookies_set_sink',
        'chrome_cookies_remove_sink',
        'chrome_storage_sync_set_sink',
        'chrome_storage_local_set_sink',
        'chrome_history_addUrl_sink',
        'chrome_history_deleteUrl_sink',
        'chrome_history_deleteRange_sink',
        'chrome_history_deleteAll_sink',
        'chrome_downloads_download_sink',
        'chrome_downloads_pause_sink',
        'chrome_downloads_resume_sink',
        'chrome_downloads_cancel_sink',
        'chrome_downloads_open_sink',
        'chrome_downloads_show_sink',
        'chrome_downloads_showDefaultFolder_sink',
        'chrome_downloads_erase_sink',
        'chrome_downloads_removeFile_sink',
        'chrome_downloads_setShelfEnabled_sink',
        'chrome_downloads_acceptDanger_sink',
        'chrome_downloads_setShelfEnabled_sink',
        'XMLHttpRequest_sink'
]

user_sink = [
    # to document
    'JQ_obj_val_sink',
    'JQ_obj_html_sink',
    # to window
    'window_postMessage_sink'
]




def get_all_sign_list():
    """
    return a list of all the signature functions
    """
    res = []
    for key in signature_lists:
        res += signature_lists[key]

    return res

