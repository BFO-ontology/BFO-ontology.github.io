import requests
from bs4 import BeautifulSoup
import sys

def get_link_status(url: str) -> int:
    """
    Checks whether a website is up or not
    :param url: website to check
    :return: return code from the website
    """
    return_code = 999
    try:
        # Fix rude websites returning 403
        headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:100.0) Gecko/20100101 Firefox/100.0",
                   "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8"}
        request = requests.get(url, timeout=10, headers=headers)
        return_code = request.status_code
    except Exception:
        pass  # https://www.youtube.com/watch?v=ZcJjMnHoIBI
    finally:
        return return_code

if __name__ == "__main__":
    with open("users.html", "r") as html_file:
        with open("link-results.txt", "w") as outfile:
            sys.stdout = outfile
            soup = BeautifulSoup(html_file.read(), "html.parser")
            for a_tag in soup.find_all("a"):
                if "http" in a_tag['href']:
                    link_status = get_link_status(a_tag['href'])
                    if link_status == 999:
                        print("Bad link " + a_tag['href'] + " connection failed")
                    elif link_status not in [200, 503]:
                        print("Bad link " + a_tag['href'] + " returned " + str(link_status))
