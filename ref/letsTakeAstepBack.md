i want to take a step back to simplify the files in this project so i can better debug it. \
So we have a folder called sections which is used by navabar to navigate to the different sections of the portfolio & it contains these 5 jsx files: Hero (which should be renamed home really), Sites, Animations,Videos, Art. \
And it also contains Navbar which (in my opinion is a component so it should be moved there). \
But these 5 jsx are only the html layer of each page. And in each section there must be a canvas and an html overlay. \
Hero.jsx doesn't follow this rule because it is called by Layout.jsx (which is in the components folder) which calls also Canvas3D.jsx (also in the components folder). \
So let's have a look at what's in the components folder which contains 6 jsx files: \
Canvas3D.jsx: which should really be called home-canvas.jsx and be in the sections folder \
CanvasLoader.jsx: it is used by hero just to display a progress bar while the page loads \
Content.jsx: which should be home.jsx (because it contains the html content) and the content of the present hero.jsx should be moved over to Layout.jsx. \
deskNpc.jsx: which is calling the glb file but it should really be integrated in home-canvas.jsx (when we create it) \
Layout.jsx: is where the navbar,html-content and canvas content gets assembled and called from App.jsx \
LigthsNhelpers: is a component! (the other two real components being Layout.jsx & canvasLoader.jsx) because I would like to reuse it in the different Canvases of the different sections. \
So I opened all the files and I would like to make the changes I mentioned.

present situation: \
│   App.jsx \
│ \
├───components \
│       Canvas3D.jsx \
│       CanvasLoader.jsx \
│       Content.jsx \
│       deskNpc.jsx \
│       Layout.jsx \
│       LightsNhelpers.jsx \
│ \
└───sections \
        Animations.jsx \
        Art.jsx \
        Hero.jsx \
        Navbar.jsx \
        Sites.jsx \
        Videos.jsx

desired situation: \
│   App.jsx \
│ \
├───components \
│       Navbar.jsx \
│       Canvas3D.jsx (this should be removed from here and put in sections as "Home-canvas.jsx") \
│       CanvasLoader.jsx \
│       Content.jsx (this should be removed from here and it's content be put in Home.jsx) \
│       deskNpc.jsx (this should be removed from here and it's content be merged in Home-canvas.jsx) \
│       Layout.jsx (see comment below on Home.jsx) \
│       LightsNhelpers.jsx \
│ \
└───sections \
        Animations.jsx \
        Art.jsx \
		Home-canvas.jsx (see comment above) \
        Home.jsx (renamed from "Hero.jsx but it's content (apart from parts what's in the canvas tag, which should go in Home-canvas.jsx) should be in Layout.jsx) \
        Sites.jsx \
        Videos.jsx \
So I created Home.jsx & Home-canvas.jsx. \
But left all present files untouched so as not to disrupt what is working. \
I created a Navbar.jsx in Components. \
All the relevant files to modify are opened in VScode. \
Please advise on how to change their content. \
When we are finished and everything is working as it is now, I'll delete: \
sections/Hero.jsx \
sections/Navbar.jsx \
components/Canvas3D.jsx \
components/Content.jsx \
components/deskNpc.jsx \

│   App.jsx \
│ \
├───components \
│       Navbar.jsx \
│       Canvas3D.jsx \
│       CanvasLoader.jsx \
│       Content.jsx \
│       deskNpc.jsx \
│       Layout.jsx \
│       LightsNhelpers.jsx \
│ \
└───sections \
        Animations.jsx \
        Art.jsx \
		Home-canvas.jsx \
        Home.jsx \
        Sites.jsx \
        Videos.jsx \