# First Time Setup

In the scripts directory, execute
```
    pip3 install -r requirements.txt
```
# Updating Users

The input is a csv file, users.csv in the parent/root directory.

The spreadsheet has four columns. Each row has:

 - **name**: The name of the user/ontology/group
 - **description**: Extra text for the entry. Use e.g. [link]\(http://example.com) if you want a hyperlink in that text.
 - **underneath**: 	Where the entry goes. The top level groups are "Ontologies" and "Institutions, Groups and Projects". If you want an entry nested below another, put the name of the one you want it nested in here. The value must exactly match the name. Every row MUST have a value.
 - **URL**: The URL for the entry 

When users.csv is changed, run the make-users script in the same directory as users.csv (same as users.html). Then check in the modified version of users.html.

On windows
```sh
python scripts/make-users.py
```
On a Mac
```sh
python3 scripts/make-users.py
```

# Checking that the URLs work

In the same directory as users.csv, you can run the check-links script to see whether any of the URLs are broken.
After the script finishes, the report is in the file link-results.txt

On windows
```sh
python scripts/check-links.py
```
On Mac
```sh
python3 scripts/check-links.py
```

