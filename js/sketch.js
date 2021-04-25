// Declares global variables 
var navbar;
var profile = "https://cdn.glitch.com/08bd8032-1b40-4d66-bcc7-e85b79f74251%2Fwumpus_profile.gif?v=1618749206707";
var terminal = "https://cdn.glitch.com/08bd8032-1b40-4d66-bcc7-e85b79f74251%2Fterminal.png?v=1618754409112";
var spotify = "https://cdn.glitch.com/08bd8032-1b40-4d66-bcc7-e85b79f74251%2Fspotify.png?v=1618757664761";
var discord = "https://cdn.glitch.com/08bd8032-1b40-4d66-bcc7-e85b79f74251%2Fdiscord.png?v=1618758764635";
var ubuntuLight = "https://cdn.glitch.com/08bd8032-1b40-4d66-bcc7-e85b79f74251%2FUbuntu-L.ttf?v=1619108006041";
var ubuntuRegular = "https://cdn.glitch.com/08bd8032-1b40-4d66-bcc7-e85b79f74251%2FUbuntu-R.ttf?v=1619108136688";
var ubuntuMedium = "https://cdn.glitch.com/08bd8032-1b40-4d66-bcc7-e85b79f74251%2FUbuntu-M.ttf?v=1619108243708";
var keypress = "";
var openApps = [];

// Preloads all the images
function preload () {

    profile = loadImage ( profile );
    terminal = loadImage ( terminal );
    spotify = loadImage ( spotify );
    discord = loadImage ( discord );
    ubuntuLight = loadFont ( ubuntuLight );
    ubuntuRegular = loadFont ( ubuntuRegular );
    ubuntuMedium = loadFont ( ubuntuMedium );

}

// Sets up the canvas
function setup () {

    // Creates the canvas
    createCanvas ( window.innerWidth, window.innerHeight );
    angleMode ( DEGREES );
    textFont ( ubuntuRegular );

    // Creates the navbar 
    navbar = new Navbar ( height, profile );
    terminal = new Icon ( terminal, "Terminal" );
    spotify = new Icon ( spotify, "Spotify" );
    discord = new Icon ( discord, "Discord" );

    navbar.addApp ( terminal );
    navbar.addApp ( spotify );
    navbar.addApp ( discord );

}

// Updates the canvas
function draw () {

    // Resets the canvas
    background ( colors.background );

    // Displays all the apps
    for ( var app of openApps ) {

        app.update ();

    }

    // Displays the navbar
    navbar.show();

    // Resets the keypress
    keypress = "";

}

// When the mouse is clicked
function mouseClicked () {

    // Loops throught the icons 
    // To check if the mouse was over one of the apps
    for ( var icon of navbar.icons ) {

        // Checks if the icon was clicked
        if ( icon.hover ( mouseX, mouseY ) ) {

            openApps.push ( new Terminal () );

            return;

        }

    }

    // Loops through the open windows 
    // To check if the cursor was hovering over any buttons
    for ( var app of openApps ) {

        // Checks if any navigation actions were clicked
        const navActions = app.navActionClicked ( mouseX, mouseY );
        if ( navActions === "Close" ) { app.close (); }
        if ( navActions === "Max" ) { app.max (); }
        if ( navActions === "Min" ) { app.min (); }

    }

}

// Listens for keypresses
window.addEventListener("keypress", function(e) {
    if ( e.which !== 13 ) {
        keypress = String.fromCharCode(e.keyCode);
    }
});

window.addEventListener("keydown", function(e) {
    if ( e.which === 8 ) {
        keypress = "backspace";
    } else if ( e.which === 13 ) {
        keypress = "enter";
    }
});