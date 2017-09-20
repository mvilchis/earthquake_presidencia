# Calculates the mean and median salaries for each school based on BPShighschool.csv
# and writes to salaries.json

import csv, json

hs = set(['Another Course to College','Boston Arts Academy','Community Academy','Boston International HS', 
		'Boston Latin School', 'Brighton High', 'Burke High', 'Charlestown High',
		'Community Leadership Academy', 'Dorchester Academy', 'East Boston High', 'English High',
		'Excel High', 'Fenway High', 'Kennedy Health Careers Academy', 'Lyon Pilot High 9-12',
		'Madison Park High', 'Margarita Muniz Academy', 'New Mission High', 'Snowden International',
		'Quincy Upper School', 'Urban Science Academy', 'West Roxbury Academy', 'Boston Green Academy',
		'Tech Boston Academy', 'Boston Latin Academy', "O'Bryant School"
	])

# Function to compute mean of list, rounded to nearest hundredth
def mean(l):
	return round(sum(l) / len(l), 2)

# Function to compute median of list
def median(lst):
    sortedLst = sorted(lst)
    lstLen = len(lst)
    index = (lstLen - 1) // 2

    if (lstLen % 2):
        return sortedLst[index]
    else:
        return round((sortedLst[index] + sortedLst[index + 1])/2.0, 2)

# Convert set to dictionary
# schools is a dictionary of school name, nested dictionary of salaries keyed by teacher name pairs
schools = dict.fromkeys(hs)

# Populate dictionary
with open('BPShighschool.csv', 'rb') as inp:
	for row in csv.reader(inp):
		if row[2] != 'DEPARTMENT NAME':
			if schools[row[2]] is None:
				schools[row[2]] = {row[0]:float(row[10])}
			else:
				schools[row[2]][row[0]] = float(row[10])

salary_data = dict.fromkeys(hs)

# Add salary dictionary for each school
for school, _ in salary_data.items():
	salary_data[school] = {'salaries': schools[school]}

# Add mean and median for each school
for school, _ in salary_data.items():
	salary_data[school]['mean'] = mean(schools[school].values())
	salary_data[school]['median'] = median(schools[school].values())

f = open('salaries.json', 'w')
f.write(json.dumps(salary_data))
f.close