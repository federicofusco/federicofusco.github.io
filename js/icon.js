// This class defines the app icons in the navbar
class Icon {

    // This defines the class 
    constructor ( image, name ) {

        this.image = image;
        this.name = name;

    }

    // Displays the icon
    show ( x, y, width, height ) {

        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        // Displays the icon
        push();
            translate ( x, y );
            image ( this.image, 0, 0, width, height );
        pop ();
    }

    hover ( mouseX, mouseY ) {

        // Corners
        const topLeft = createVector ( this.x, this.y, 10 ); 
        const topRight = createVector ( this.x + this.width, this.y, 10 );
        const bottomLeft = createVector ( this.x, this.y + this.height, 10 );

        // Checks if the cursor is hovering over the icon
        if ( ( bottomLeft.y > mouseY && mouseY > topLeft.y ) && 
             ( topLeft.x < mouseX && mouseX < topRight.x ) ) {
            
                // Displays app name
                push();

                    // Displays the background
                    fill ( colors.darkGrey );
                    textSize ( 15 );
                    rect ( this.x + this.width + 20, this.y + this.height / 2 - 10, textWidth ( this.name ) + 20, 20, 5, 5 );
                
                    // Displays the name
                    fill ( colors.white );
                    text ( this.name, this.x + this.width + 30, this.y + this.height / 2 + 5 );
                
                pop();

            return true;

        }  
    
        
    }

}