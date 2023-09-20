# opalyte
DISCLAIMER: This is app is incredibly unfinished and probably won't be particularly performant or good even when it is

## A Notes App for the Stupid

Opalyte is a notes app designed to provide a simple and intuitive solution for organizing your thoughts, tasks, and reminders. While it may not be the most feature-rich or sophisticated app available, it aims to be the right choice for individuals who prefer a straightforward and uncomplicated approach to note-taking.
Key Features

* Create and Organize: Opalyte allows you to effortlessly create and manage your notes, tasks, and reminders. Whether it's jotting down quick ideas, tracking your to-do list, or setting important reminders, Opalyte has you covered.

* Flexible Attachments System: With Opalyte's unique attachments system, you can easily connect different notes, tasks, and reminders together. This system is not limited to internal resources but also supports importing external (this is not implemented yet only inter-item attachments currently work). Moreover, it enables you to establish connections between various sources, regardless of their type (note, task, or reminder, or in the future external media like photos).

* Simple Folder System: Opalyte utilizes a straightforward folder system to help you keep all your relevant notes, tasks, and reminders neatly organized and grouped. This way, you can easily locate and access the information you need when you need it.

## Getting Started

To run Opalyte locally, follow these instructions:

1. Check that you have the required dependencies.  These are Python3, pip, and a browser (chrome/chromium is the default).

2. Clone the repository to your local machine.

   ```bash
   git clone https://github.com/internet-raider/opalyte.git
   ```

4. Set up a virtual environment using the provided requirements file. Open a terminal and navigate to the project's root directory. Then, execute the following commands:

   ```bash
   python3 -m venv venv  # Create a new virtual environment
   source venv/bin/activate  # Activate the virtual environment
   pip install -r requirements.txt  # Install the required packages
   ```

5. Modify the browser setting in the `settings.json` file to specify your preferred browser. By default, Opalyte uses Chrome/Chromium. You can change this setting to any other compatible browser installed on your system.

6. Launch Opalyte by running the main script:

   ```bash
   python main.py
   ```

   The app's graphical user interface should open in your default browser.  We recommend using chrome/chromium (either works with no modification), electron, or edge as firefox doesn't default to an app window.
