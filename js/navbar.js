// This class defines the system navbar
class Navbar {

    // Defines the class
    constructor ( canvasHeight, profile ) {

        this.margins = [30, 30];
        this.color = colors.darkGrey;
        this.padding = [14, 13];
        this.width = 60;
        this.height = canvasHeight - this.margins[1] * 2;
        this.textPadding = 7;
        this.textHeight = 12;
        this.profile = profile;
        this.profilePadding = 5;
        this.icons = [];
        this.iconWidth = 37;
        this.profileWidth = ( this.width - this.profilePadding * 2.5 );
        this.appMargins = [this.width - this.iconWidth - 10 + this.margins[0], this.margins[1] + this.padding[1] + this.textPadding * 6 + 16];

    }

    // Adds an app icon to the navbar
    addApp ( icon ) {
        this.icons.push ( icon );
    }

    // Displays the navbar
    show () {

        // Displays the container
        stroke ( this.color );
        fill ( this.color );
        rect ( this.margins[0], this.margins[1], this.width, this.height, 10, 10 );

        // Displays the time
        push();
            translate ( this.margins[0] + this.padding[0], this.margins[1] + this.padding[1] );
            fill ( colors.white );
            strokeWeight ( 0.5 );
            stroke ( colors.white );
            textSize ( 13 );

            // Padds one digit numbers with a 0
            function paddNumber ( x ) {
                if ( x < 10 ) {
                    return `0${x}`;
                } else {
                    return x;
                }
            }

            text ( `${paddNumber(new Date().getHours())}:${paddNumber(new Date().getMinutes())}`, 0, this.textPadding);
        pop();

        // Displays the Wifi meter
        push();
            translate ( this.margins[0] + this.padding[0] - 3, this.margins[1] + this.padding[1] + this.textPadding * 2 );
            fill ( colors.green );
            strokeWeight ( 0 );
            rect ( 0, 10, 4, 3, 2, 2);
            rect ( 5, 6, 4, 7, 2, 2);
            rect ( 10, 2, 4, 11, 2, 2);
        pop();

        // Displays the dropdown arrow
        push();
            translate ( this.margins[0] + this.padding[0] + 12, this.margins[1] + this.padding[1] + this.textPadding * 2 )
            fill ( colors.white );
            strokeWeight ( 0 );
            rotate ( -40 );
            rect ( 0, 6, 3, 12, 2, 2 );
            rotate ( 80 );
            rect ( 16, -10, 3, 12, 2, 2 );
        pop();

        // Displays the icon divider
        push();
            translate ( this.margins[0] + this.padding[0], this.margins[1] + this.padding[1] + this.textPadding * 4 + 13 );
            fill ( colors.grey );
            strokeWeight ( 0 );
            rect ( 0, 0, 30, 3, 2, 2 );
        pop();

        // Displays all the apps
        for ( var x = 0; x < this.icons.length; x++ ) {

            this.icons[x].show ( this.appMargins[0], this.appMargins[1]  + ( this.iconWidth + this.textPadding ) * x, this.iconWidth, this.iconWidth );
            this.icons[x].hover(mouseX, mouseY);

        }

        // Displays the profile picture
        push();
            translate ( this.margins[0] + this.width - this.profileWidth - this.profilePadding, this.margins[1] + this.height - this.profileWidth - this.profilePadding );
            image ( this.profile, 0, 0, this.profileWidth, this.profileWidth );
        pop();

    }
}