import csv
import subprocess
import json
import argparse
import string
import os
from tqdm import tqdm

fail_log = open('fail.log', 'w')
success_log = open('success.log', 'w')


def main():
    parser = argparse.ArgumentParser(
        description='Process some integers.')
    parser.add_argument('-f', help='csv file')
    args = parser.parse_args()
    filename = args.f  # "./test.csv"

    with open(filename, 'r') as fp:
        os.system('mkdir -p packages')
        os.chdir("packages")
        reader = csv.reader(fp, dialect='excel')
        tqdm_bar = tqdm(list(reader))
        for row in tqdm_bar:
            tqdm_bar.set_description("Installing {}".format(row[0].strip()))
            try:
                package_name = row[0].strip()
                package_name = package_name.lower()
                package_version = row[1].strip()
            except:
                fail_log.write('failed to parse npm package')
            download_package(package_name, package_version)


def download_package(name, version):
    try:
        dir_name = "{}@{}".format(name, version)

        archive = "{}-{}.tgz".format(name, version)
        curl_cmd = 'curl --silent --remote-name https://registry.npmjs.org/{}/-/{}'.format(
            name, archive)

        os.system(curl_cmd)
        os.system('mkdir -p {}'.format(
            dir_name))

        if archive[0] == '@':
            archive = archive.split('/')[1]
        os.system('tar xzf {} --strip-components 1 -C {}'.format(
            archive, dir_name))
        #os.system('cd {}; npm install >output.log 2>&1'.format(
        #    dir_name))

    except:
        fail_log.write('{}@{} failed \n'.format(name, version))
        fail_log.flush()
        return

    success_log.write('{}@{} success \n'.format(name, version))
    success_log.flush()


if __name__ == "__main__":
    main()
