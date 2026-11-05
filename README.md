# Omar Ahmed: Engineering Portfolio

Plain HTML, CSS, JavaScript and C++. No build step, no dependencies.

## Structure
```
portfolio/
  index.html            page structure
  css/styles.css        all styling
  js/data.js            EDIT THIS: contact info, skills, project content
  js/main.js            rendering, navigation, project pages
  js/code.js            C++ code viewer and JavaScript ALU demo
  cpp/alu_model.cpp     4-bit ALU model (C++)
  cpp/fuzzy_membership.cpp  fuzzification concept study (C++)
  assets/resume.pdf     YOU ADD: your resume
  assets/profile.jpg    optional profile photo
  assets/projects/      your project photos
```

## Run it in VS Code
1. File > Open Folder > select `portfolio`.
2. Install the **Live Server** extension, right-click `index.html`, choose **Open with Live Server**.
   (The Code section loads `.cpp` files with `fetch`, which needs a server. Double-clicking `index.html` works for everything else.)

## Run the C++ examples
```
cd cpp
g++ -std=c++17 -Wall -o alu_model alu_model.cpp && ./alu_model
g++ -std=c++17 -Wall -o fuzzy fuzzy_membership.cpp && ./fuzzy
```
Add a new example: save it in `cpp/` and add its name to `FILES` in `js/code.js`.

## Edit your content (all in js/data.js)
- **Contact info and photo:** fill in `CONFIG` (email, linkedin, github, location, profilePhoto).
- **Resume:** save your PDF as `assets/resume.pdf`, then delete the yellow note under the button in `index.html`.
- **Project photos:** copy images into `assets/projects/`, then in `PROJECTS` add
  `{src:"assets/projects/robot1.jpg",alt:"What the image shows"}` to that project's `media` array.
  Remove matching items from its `todo` list.
- **Skills:** edit `SKILLS`.

## Deploy on GitHub Pages
1. Create a repository and upload everything in `portfolio`.
2. Settings > Pages > Source: Deploy from a branch > `main` and `/ (root)` > Save.
3. Your site appears at `https://YOUR-USERNAME.github.io/REPO-NAME/` after a minute or two.

## Honesty notes
The two C++ files are learning examples written to illustrate concepts. They are labeled that way on the site. Keep them labeled that way unless you rewrite them as your own projects.
