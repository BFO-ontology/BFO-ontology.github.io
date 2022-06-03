from datetime import date
from bs4 import BeautifulSoup, Tag
from dataclasses import dataclass
from typing import List, Tuple
from csv import DictReader
from warnings import warn
import re
import markdown as md

@dataclass
class BfoUser:
    __slots__ = ['name', 'description', 'underneath', 'url']
    name: str
    description: str
    underneath: str
    url: str

    def __init__(self, name: str, description: str, underneath: str, url: str):
        self.name = name
        self.description = description
        self.underneath = underneath
        self.url = url

    def as_dict(self):
        return {'name': self.name, 'description': self.description, 'underneath': self.underneath, 'url': self.url}

def user_list_names_groups(users: List[BfoUser]) -> Tuple[List[str], List[str]]:
    """
    Given a list of users returns the unique groups and names among them
    :param users: users to get groups and names from
    :return: unique groups and names form users
    """
    names = []
    groups = []
    for user in users:
        if user.name not in names:
            names += [user.name]
        if user.underneath not in groups:
            groups += [user.underneath]
    return names, groups

def gen_li_tag(soup: BeautifulSoup, users: List[BfoUser]) -> Tag:
    """
    Given a List of at least 1 user and potentially sub-users generate a li tag for it
    :param soup: soup representing the html tree
    :param users: list of user and potentially sub-user
    :return: li tag representing user and sub-users
    """
    if len(users) < 1:
        print("Got bad user list. List must have at least one user")
        exit(1)
    li_tag = soup.new_tag("li")
    if len(users) == 1:
        main_user, sub_users = users[0], None
    else:
        main_user, sub_users = users[0], users[1:]
    if main_user.url != "":
        a_tag = soup.new_tag("a", href=main_user.url)
        a_tag.append(main_user.name)
        li_tag.append(a_tag)
        m = md.Markdown()
        # Ugly but allows tags in description to be parsed correctly
        des = str(li_tag)[:-5] + m.convert(main_user.description).replace("<p>", "").replace("</p>", "") + "</li>"
        li_tag = BeautifulSoup(des, "html.parser")
    else:
        li_tag.append(main_user.name)
    if sub_users is not None:
        li_tag.append(gen_ul_tag(soup, sub_users.copy()))
    return li_tag

def gen_ul_tag(soup: BeautifulSoup, users: List[BfoUser]) -> Tag:
    """
    Given a list of users create the ul tag representing those users
    :param soup: soup representing the html tree
    :param users: users to generate ul tag for
    :return: generated ul tag
    """
    if len(users) < 1:
        print("Got bad user list. List must have at least one user")
        exit(1)
    users: List = users  # Retype to avoid IDE complaints
    ul_tag: Tag = soup.new_tag("ul")
    li_embedded_ul_names: List[str] = []
    names, groups = user_list_names_groups(users)
    if len(groups) > 1:  # Prevent infinite recursion for ul embedded ul
        for group in groups:
            if group in names:  # Check for li embedded ul
                li_embedded_ul_names += [group]
    users.sort(key=lambda user: user.name.upper())  # Alphabetize users
    for li_embedded_ul_name in li_embedded_ul_names:  # Handle li embedded ul's
        li_embedded_ul_user_list: List[BfoUser] = [users[0]]  # Placeholder for first user
        main_user_i: int = 9999
        for i in range(len(users)):
            if isinstance(users[i], BfoUser):  # Catch Lists
                if users[i].name == li_embedded_ul_name:  # This is the main user
                    li_embedded_ul_user_list[0] = users[i]
                    main_user_i = i  # Save position in user list
                elif users[i].underneath == li_embedded_ul_name:  # This is a sub-user
                    li_embedded_ul_user_list += [users[i]]
        if main_user_i != 9999:  # Make sure we found the main user
            for user in li_embedded_ul_user_list:
                users.remove(user)  # Remove user from main list
            users[main_user_i] = li_embedded_ul_user_list
        else:
            warn(f"Could not find main user for sub-user group {li_embedded_ul_name}.")
            exit(4)
    for user in users:
        if isinstance(user, Tag):
            ul_tag.append(user)  # If this is an embedded ul tag just append it
        elif isinstance(user, List):
            ul_tag.append((gen_li_tag(soup, user)))
        else:
            ul_tag.append(gen_li_tag(soup, [user]))  # if this is a user with/without sub-users append it's generated li
    return ul_tag

def parse_csv(csv_path: str) -> List[BfoUser]:
    csv_file = None
    try:
        csv_file = open(csv_path, "r", newline='')
    except Exception:
        print(f"Could not open csv file at path {csv_path}")
        exit(5)
    users: List[BfoUser] = []
    reader = DictReader(csv_file, list(BfoUser.__slots__))
    reader.__next__()  # Throw out header
    for user_dict in reader:
        users += [BfoUser(user_dict['name'], user_dict['description'], user_dict['underneath'], user_dict['url'])]
    csv_file.close()
    return users

def gen_users_html(users: List[BfoUser], html_prologue: str, html_epilogue: str) -> BeautifulSoup:
    """
    Given a list of users, and html prologue and epilogue generates the users page
    :param users: list of users
    :param html_prologue: html to insert at top of page
    :param html_epilogue: html to insert at bottom of page
    :return: soup object representing the html
    """
    soup_text = html_prologue
    soup = BeautifulSoup("", "html.parser")
    top_groups = []
    names, groups = user_list_names_groups(users)
    for group in groups:
        if group not in names and group not in top_groups:
            top_groups += [group]
    for top_group in top_groups:
        header = soup.new_tag("h3")
        header.append(top_group)
        soup_text += str(header)
        top_users = []
        for user in users:
            if user.underneath == top_group:
                top_users += [user]
            elif user.underneath not in top_groups:
                for _user in users:
                    if user.underneath == _user.name:
                        if _user.underneath == top_group:
                            top_users += [user]
        tag = gen_ul_tag(soup, top_users)
        soup_text += str(tag)
    html_epilogue = re.sub('Last changed on .*<', r'Last changed on ' + str(date.today()) + '<', html_epilogue)
    soup_text += html_epilogue
    soup = BeautifulSoup(soup_text, "html.parser")
    return soup

if __name__ == "__main__":
    header, footer = open("user-page-header.html", "r"), open("user-page-footer.html", "r")
    stuff = gen_users_html(parse_csv("users.csv"), header.read(), footer.read())
    header.close()
    footer.close()
    with open("users.html", "w") as users_file:
        users_file.write(stuff.prettify())
