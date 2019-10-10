import csv
import subprocess
import json
import argparse
import string


def main():
    parser = argparse.ArgumentParser(
        description='Process some integers.')
    parser.add_argument('-f', help='csv file')
    args = parser.parse_args()
    filename = args.f  # "./test.csv"
    fail_log = open('fail.log', 'w')
    success_log = open('success.log', 'w')
    with open(filename, 'r') as fp:
        reader = csv.reader(fp, dialect='excel')
        for row in reader:
            try:
                package_name = row[0].strip()
                package_version = row[1].strip()
                print(package_name, package_version)
                print('npm install {}@{}'.format(
                    package_name.lower(), package_version))
                subprocess.check_call('npm install {}@{}'.format(
                    package_name.lower(), package_version), shell=True)
            except Exception as e:
                fail_log.write('{}@{} failed \n'.format(package_name, package_version))
                continue
            success_log.write('{}@{} success \n'.format(package_name, package_version))


if __name__ == "__main__":
    main()
