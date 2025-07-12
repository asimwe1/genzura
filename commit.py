import git
import random
from datetime import datetime, timedelta
from pathlib import Path
import os

# Initialize the Git repository
repo_path = "."  # Adjust if your repository path differs
repo = git.Repo(repo_path)

# Update the remote URL to the new repository
repo.git.remote("set-url", "origin", "git@github.com:asimwe1/genzura.git")
print("Updated remote URL to git@github.com:asimwe1/genzura.git")

# Define the time range for commits (CAT timezone, UTC+2)
start_date = datetime(2025, 7, 12, 0, 0)
end_date = datetime(2025, 7, 14, 23, 59)
total_days = (end_date - start_date).days + 1  # Include July 14

# Professional commit message templates (Conventional Commits)
commit_templates = [
    ("feat", "Add {} functionality to enhance inventory management"),
    ("fix", "Fix issue in {} causing display errors"),
    ("docs", "Update {} documentation for better clarity"),
    ("refactor", "Refactor {} to improve code readability"),
    ("style", "Apply styling updates to {} for consistency"),
    ("test", "Add tests for {} to ensure stability"),
    ("chore", "Update {} configuration for better performance"),
]

# Get list of changed, deleted, or untracked files
def get_changed_files():
    changed_files = []
    # Store file statuses to handle deleted files
    file_status = {}
    
    # Modified and deleted files from git status
    for item in repo.git.status(["--porcelain"]).splitlines():
        status, path = item.split(maxsplit=1)
        file_status[path] = status
        changed_files.append(path)
    
    # Untracked files
    for item in repo.untracked_files:
        if item not in changed_files:
            changed_files.append(item)
            file_status[item] = "??"
    
    # Expand untracked directories to include their files
    directories = ["app/departments/", "app/manage-store/", "app/others/", "app/payroll/", 
                   "app/products/", "app/reports/", "app/settings/", "app/suppliers/", "hooks/"]
    for dir_path in directories:
        if os.path.exists(dir_path):
            for root, _, files in os.walk(dir_path):
                for file in files:
                    file_path = os.path.join(root, file)
                    if file_path not in changed_files:
                        changed_files.append(file_path)
                        file_status[file_path] = "??"
    
    # Exclude .next, .git, node_modules
    excluded = {".next", ".git", "node_modules"}
    return [(f, file_status.get(f, "??")) for f in changed_files if not any(ex in f for ex in excluded)]

# Generate a commit date for a specific day with random time
def random_date_for_day(day):
    base_date = start_date + timedelta(days=day)
    random_hours = random.randint(8, 20)  # Commits between 8 AM and 8 PM
    random_minutes = random.randint(0, 59)
    return base_date.replace(hour=random_hours, minute=random_minutes, second=0)

# Generate a professional commit message
def generate_commit_message(file_path):
    commit_type, template = random.choice(commit_templates)
    file_name = Path(file_path).name
    return f"{commit_type}: {template.format(file_name)}"

# Create commits across July 12-14, 2025
def create_commits(commits_per_day=5):
    changed_files = get_changed_files()
    if not changed_files:
        print("No changed, deleted, or untracked files found.")
        return

    # Shuffle files to randomize order
    random.shuffle(changed_files)
    
    # Distribute commits across 3 days (July 12, 13, 14)
    for day in range(total_days):  # 0, 1, 2 for July 12, 13, 14
        # Number of commits for this day (up to commits_per_day or remaining files)
        num_commits = min(commits_per_day, len(changed_files))
        if num_commits == 0:
            continue
        
        for _ in range(num_commits):
            # Select a file to commit
            file_to_commit, status = changed_files.pop(0)
            
            # Stage the file based on status
            try:
                if status == "D" and not os.path.exists(file_to_commit):
                    repo.git.rm(file_to_commit, cached=True)  # Stage deletion without removing file
                elif os.path.exists(file_to_commit):
                    repo.git.add(file_to_commit)
                else:
                    print(f"Skipping {file_to_commit}: File does not exist and not marked as deleted.")
                    continue
            
                # Generate commit message and date
                commit_message = generate_commit_message(file_to_commit)
                commit_date = random_date_for_day(day).strftime("%Y-%m-%dT%H:%M:%S+02:00")
                
                # Commit with specified date
                repo.git.commit(m=commit_message, date=commit_date)
                print(f"Committed {file_to_commit} with message: {commit_message} on {commit_date}")
            
            except git.exc.GitCommandError as e:
                print(f"Failed to commit {file_to_commit}: {e}")
                continue
            
        if not changed_files:
            break

if __name__ == "__main__":
    # Create up to 5 commits per day across July 12-14, 2025
    create_commits(commits_per_day=5)