import matplotlib.pyplot as plt
import json
import os

def main():
    with open('crx.log') as f:
        content = f.read()

    blocks = content.split('run extension/media/data2/song/extensions/unzipped_extensions/')
    blocks = [x for x in blocks if x!='']
    no_timeout_time = 0
    ids = set()
    covs = []

    timeout_ids_cov = {}
    no_vul_ids = []
    error_ids = []

    for block in blocks:
        lines = block.split('\n')
        id = lines[0]
        if id in ids:
            continue
        else:
            ids.add(id)
        time = 0
        if lines[-2].endswith('second spent####'):
            time = lines[-2].split('second spent####')[0]
        elif lines[-2].endswith(' spent####'):
            time = lines[-2].split(' spent####')[0]
        if time!=0:
            no_timeout_time += float(time)
            no_vul_ids.append(id)
        # print(time)
        elif 'timeout after' in block:
            # cov = lines[-2]
            cov = lines[-2].split(' stmt covered####')[0]
            cov = cov.split('%')[0]
            cov = float(cov)
            timeout_ids_cov[id] = cov
            # print(cov)
            covs.append(cov)
        else:
            error_ids.append(id)


    print('total: ', len(ids), ' extenions')
    print(len(no_vul_ids), ' extensions run without error')
    print('avarage analyzing time: ', no_timeout_time/len(no_vul_ids), ' seconds')
    print(len(timeout_ids_cov), ' extensions timeout')
    print(len(error_ids), ' extensions run with error')
    
    if not os.path.isdir('crx_record'):
        os.mkdir('crx_record')
    with open('crx_record/timeout.json', 'w') as f:
        content = json.dumps(timeout_ids_cov)
        f.write(content)
    with open('crx_record/error.json', 'w') as f:
        content = json.dumps(error_ids)
        f.write(content)
    with open('crx_record/no_vul.json', 'w') as f:
        content = json.dumps(no_vul_ids)
        f.write(content)

    plt.bar(range(len(covs)), covs)
    plt.title('code coverage of timeout extension (%)')
    plt.show()


main()





