from playwright.sync_api import sync_playwright, Page, expect

def test_landing_page(page: Page):
    """
    This test verifies that the landing page renders correctly.
    """
    # 1. Arrange: Go to the application's root URL.
    page.goto("http://localhost:3000")

    # 2. Assert: Check for the main headline to ensure the page has loaded.
    expect(page.get_by_role("heading", name="CloudRay: The Free, Unlimited Cloud Storage")).to_be_visible()

    # 3. Screenshot: Capture the final result for visual verification.
    page.screenshot(path="jules-scratch/verification/landing_page.png")

# Boilerplate to run the test
if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        test_landing_page(page)
        browser.close()