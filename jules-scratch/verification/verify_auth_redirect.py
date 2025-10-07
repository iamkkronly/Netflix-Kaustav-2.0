from playwright.sync_api import sync_playwright, Page, expect

def test_auth_redirect(page: Page):
    """
    This test verifies that an unauthenticated user is redirected from
    the dashboard to the login page.
    """
    # 1. Arrange: Go to the protected dashboard URL.
    page.goto("http://localhost:3000/dashboard")

    # 2. Assert: Check that the URL is now the login page.
    expect(page).to_have_url("http://localhost:3000/login")

    # 3. Assert: Check for the login page headline to ensure it has loaded.
    expect(page.get_by_role("heading", name="Login to CloudRay")).to_be_visible()

    # 4. Screenshot: Capture the final result for visual verification.
    page.screenshot(path="jules-scratch/verification/auth_redirect.png")

# Boilerplate to run the test
if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        test_auth_redirect(page)
        browser.close()