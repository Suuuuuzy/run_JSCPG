import json
import os

class DepdData:

    def __init__(self, json_path):
        with open(json_path, 'r') as json_file:
            self.json_data = json.load(json_file)

    def get_value(self, package_name):
        """
        return a list of packages under this dict
        """
        if package_name not in self.json_data:
            return []
        res_list = self.json_data[package_name]
        return res_list
        return [os.path.basename(p) for p in res_list]

depd = DepdData('./back_depd.json')
undefsafe_use_list = depd.get_value('undefsafe')
express_use_list = depd.get_value('express')
both_use_list = [p for p in undefsafe_use_list if p in express_use_list]
print(both_use_list)

