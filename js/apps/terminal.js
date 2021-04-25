class Terminal {

    constructor ( ) {

        this.width = 500;
        this.height = 300;
        this.user = "federico@WumpusOS";
        this.cursorOffset = 7;
        this.name = "Terminal";
        this.location = "~";
        this.output = [];
        this.input = {};
        this.input.captured = true;
        this.input.frame = 0;
        this.input.value = "";

        console.log ( `[STATUS]: Opening ${this.name} window` );
    }

    close () {

        // Finds the application index
        const index = openApps.indexOf ( this );
        
        // Removes the application window
        if ( index > -1 ) {
            openApps.splice ( index, 1 );
        }

    }

    update () {

        this.show ();

    }

    show () {

        this.x = 100;
        this.y = 100;

        push ();

            // Displays main header
            translate (this.x,this.y );
            fill ( colors.grey );
            textSize ( 15 );
            textStyle ( BOLD );
            noStroke ();
            rect ( 0, 0, this.width, 30, 5, 5, 0, 0 );

            // Displays app title
            fill ( colors.white );
            text ( this.name, 0 + this.width / 2 - textWidth ( this.name ) / 2, 20 );

            // Displays the nav actions ( hide, max, close )
            fill ( colors.red );
            ellipse ( this.width - 15, 30 / 2, 13 );

            fill ( colors.yellow );
            ellipse ( this.width - 32, 30 / 2, 13 );

            fill ( colors.background );
            ellipse ( this.width - 51, 30 / 2, 13 );

            // Displays the terminal body
            fill ( colors.darkGrey );
            rect ( 0, 30, this.width, this.height, 0, 0, 5, 5 );

            // TERMINAL INPUT / OUTPUT FUNCTIONS --------------------------------------------------
            
            // Executes a command
            function executeCommand ( command, terminal) {

                // Separates command from passed arguments
                const args = command.split ( " " );
                var command = args[0];
                args.shift ();

                // Check's if it's a valid command
                if ( command === "echo" ) {

                    // Passes the output to the terminal
                    terminal.output.push({
                        message: args.join ( " " ),
                        type: "output",
                        location: terminal.location
                    });

                } else if ( command === "exit" ) {

                    // Closes the terminal window
                    terminal.close ();

                } else if ( command === "clear" ) {

                    // Clears the terminal history
                    terminal.output = [];

                } else if ( command === "help" ) {

                    // Displays the help output
                    terminal.output.push ({
                        message: "Coming soon!",
                        type: "output"
                    });

                } else if ( command === "pwd" ) {

                    // Replaces the "~" with the full path
                    var pwd = terminal["location"].replace ( "~", "/home/federico" );

                    // Logs the output to the terminal
                    terminal.output.push ({
                        message: pwd,
                        type: "output"
                    });

                } else if ( command === "ls" ) {

                    // Loops through the file system
                    let relativePath;
                    for ( var dir of terminal["location"].split ( "/" ) ) {

                        if ( !relativePath ) {
                            relativePath = files["contents"][dir];
                        } else {
                            relativePath = relativePath["contents"][dir];
                        }

                    }

                    // Logs the output to the terminal
                    terminal.output.push ({
                        message: Object.keys ( relativePath["contents"] ).join ( " " ),
                        type: "file"
                    });

                } else if ( command === "cd" ) {

                    // Checks if any have been passed
                    if ( args.length === 0 ) {

                        // Logs error to terminal
                        terminal.output.push ({
                            message: "Missing parameters: cd expects at least one parameter. To find out more, try help cd",
                            type: "error"
                        });

                        return false;
                    
                    // Checks if only one parameter has been passed
                    } else if ( args.length > 1 ) {
                        
                        // Logs error to terminal
                        terminal.output.push ({
                            message: `Unknown parameters: cd only expects 1 parameter ${args.length} given`,
                            type: "error"
                        });

                        return false;
                        
                    } else {

                        let relativePath;
                        for ( var path of terminal["location"].split ( "/" ) ) {

                            // Adds the new directory to the relative directory
                            if ( !relativePath ) {

                                // Checks if the path is a directory and not a file
                                if ( files["contents"][path].type === "file" ) {
                                    
                                    // Logs error to console
                                    terminal.output.push ({
                                        message: `/${path}: Cannot cd into a file, to find out more, try help cd`,
                                        type: "error"
                                    });

                                    return false;

                                }

                                // Updates current working directory
                                relativePath = files["contents"][path];

                            } else {

                                // Checks if the path is a directory and not a file
                                if ( relativePath["contents"][path].type === "file" ) {
                                    
                                    // Logs error to console
                                    terminal.output.push ({
                                        message: `/${path}: Cannot cd into a file, to find out more, try help cd`,
                                        type: "error"
                                    });

                                    return false;

                                }

                                // Updates current working directory
                                relativePath = relativePath["contents"][path];

                            }

                        }

                        // Checks if the directory exists
                        for ( var dir of args[0].split ( "/" ) ) {

                            if ( relativePath["contents"][dir] ) {

                                // Checks if the path is a directory and not a file
                                if ( relativePath["contents"][dir].type === "file" ) {
                                    
                                    // Logs error to console
                                    terminal.output.push ({
                                        message: `/${dir}: Cannot cd into a file, to find out more, try help cd`,
                                        type: "error"
                                    });

                                    return false;

                                }

                                // The directory exists
                                // Updates the current working directory
                                relativePath = relativePath["contents"][dir];

                                if ( args[0] !== "/" ) {
                                    terminal.location = `${terminal.location}/${args}`;
                                } else {
                                    terminal.location = `${terminal.location}${args}`;
                                }

                            } else {

                                // The directory doesn't exist
                                // Logs the error to the terminal
                                terminal.output.push ({
                                    message: `/${dir}: Unknown directory`,
                                    type: "error"
                                });

                                return false;

                            }

                        } 

                        // Outputs the success message to the terminal
                        terminal.output.push ({
                            message: `Switched to ${args}`,
                            type: "output"
                        });
                    }

                } else if ( command === "whoami" ) {

                    // Logs the output to the terminal
                    terminal.output.push ({
                        message: terminal["user"].split ( "@" )[0],
                        type: "output"
                    });

                } else if ( command === "cat" ) {

                    // Checks if an argument has been passed
                    if ( args.length === 0 ) {

                        // Logs error to the terminal
                        terminal.output.push ({
                            message: `Missing parameters: cat exptects at least 1 parameter`,
                            type: "error"
                        });

                    // Checks that only 1 parameter has been supplied
                    } else if ( args.length !== 1 ) {

                        // Logs error to the terminal
                        terminal.output.push ({
                            message: `Unknown parameters: cat only expects 1 parameter ${args.length} given`,
                            type: "error"
                        });

                    } else {

                        let relativePath;
                        for ( var path of terminal["location"].split ( "/" ) ) {

                            // Adds the new directory to the relative directory
                            if ( !relativePath ) {

                                // Updates current working directory
                                relativePath = files["contents"][path];

                            } else {

                                // Updates current working directory
                                relativePath = relativePath["contents"][path];

                            }

                        }

                        // Logs the file output to the terminal
                        terminal.output.push ({
                            message: relativePath["contents"][args[0]]["contents"],
                            type: "output"
                        });

                    }

                }
                
                
                else {

                    // Displays the error
                    terminal.output.push ({
                        message: "Unknown command, type help to find out more",
                        type: "error"
                    });

                }

            }

            // Displays the username
            function displayUser ( terminal, yOffset ) {

                // Declares local variables
                textFont ( ubuntuMedium );
                let xOffset = 7;

                // Displays username
                fill ( colors.green );
                text ( terminal.user, xOffset, yOffset );
                xOffset += textWidth ( terminal.user );

                // Displays the color (separator)
                fill ( colors.white );
                text ( ":", xOffset, yOffset );
                xOffset += textWidth ( ":" );

                // Displays the current working directory
                fill ( colors.background );
                text ( terminal.location, xOffset, yOffset );
                xOffset += textWidth ( terminal.location );

                // Displays the dollar sign (separator)
                fill ( colors.white );
                text ( "$", xOffset, yOffset );
                xOffset += textWidth ( "$" );

                // Sets the offset for the cursor
                terminal.cursorOffset = xOffset + 7;

                return {
                    width: xOffset + 7
                }

            }

            // Displays an output to the terminal based on the given offset and color
            function displayOutput ( output, xOffset, yOffset, color ) {

                // Changes the text settings
                textFont ( ubuntuRegular );
                fill ( colors[color] );

                // Checks if the 
                text ( output, xOffset, yOffset );

            }

            // Displays the terminal input
            function displayCursor ( terminal ) {

                // Checks if the input is captured by the mouse
                if ( terminal.input.captured ) {

                    // Displays the cursor
                    if ( terminal.input.frame < 40 ) {

                        var commandWidth;
                        var commandHeight;
                        if ( !`${terminal.input.value}`.includes ( "\n" ) ) {
                            commandWidth = textWidth ( `${terminal.input.value}` );
                            commandHeight = 0;
                        } else {
                            commandWidth = textWidth ( `${terminal.input["value"].split ( "\n" )[terminal.input["value"].split ( "\n" ).length - 1]}` );
                            commandHeight = ( terminal.input["value"].split ( "\n" ).length - 1 ) * 18.85;
                        }

                        // Displays the rectangle
                        fill ( colors.white );
                        rect ( terminal.cursorOffset + commandWidth - 1, 36 + terminal.output.length * 17 + commandHeight, 7, 15 );

                    }

                    // Updates the frame count
                    if ( terminal.input.frame < 80 ) {
                        terminal.input.frame++;
                    } else {
                        terminal.input.frame = 0;
                    }

                    // When a key is pressed
                    if ( keypress ) {

                        // Checks if it's a backspace
                        if ( keypress === "backspace" ) {

                            // Removes last caracter
                            terminal.input.value = terminal.input["value"].slice ( 0, -1 );

                        } else if ( keypress === "enter" ) {


                            // Executes the command
                            terminal.output.push ({
                                message: terminal.input.value,
                                type: "input"
                            });

                            executeCommand ( terminal.input.value, terminal );

                            // Clears the current input
                            terminal.input.value = "";

                        } else {

                            // Checks that the command isn't overflowing the terminal
                            // Calculates the username and command width
                            var userWidth = 7 + textWidth ( `${terminal.user}:${terminal.location}$` );
                            var commandWidth;

                            if ( !`${terminal.input.value}${keypress}`.includes ( "\n" ) ) {
                                commandWidth = textWidth ( `${terminal.input.value}${keypress}` );
                            } else {
                                commandWidth = textWidth ( `${terminal.input["value"].split ( "\n" )[terminal.input["value"].split ( "\n" ).length - 1]}${keypress}` );
                            }

                            if ( userWidth + commandWidth > terminal.width ) {

                                // Command is overflowing the terminal window
                                // Adds a newline and the character to the input value
                                terminal.input.value += `\n${keypress}`;

                            } else {

                                // Command isn't overflowing terminal window
                                // Adds the character to the input value
                                terminal.input.value += keypress;

                            }

                        }
                     }

                }                

            }

            // TERMINAL INPUT / OUTPUT ------------------------------------------------------------
            
            // Displays the terminal output
            if ( this.output.length === 0 ) {

                // Displays username
                displayUser ( this, 48 );

            } else {

                // Checks if the terminal is overflowing
                if ( this.output.length * 17 > this.height - 15 ) {

                    // The terminal is overflowing, so a line must be eliminated
                    this.output.shift ();

                }

                // There is a previous command output
                // Loops through the recorded history
                for ( var x = 0; x < this.output.length; x++ ) {

                    if ( this.output[x].type === "input" ) {

                        // Displays username and message 
                        // Displays username
                        const user = displayUser ( this, 48 + x * 17, "1" );
                        displayOutput ( this.output[x].message, user.width, 48 + x * 17, "white" );

                        // Calculates the x offset for the newline
                        var commandHeight;
                        if ( !`${this.input.value}`.includes ( "\n" ) ) {
                            commandHeight = 48 + ( x + 1 ) * 17;
                        } else {
                            commandHeight = 48 + ( x + 1 ) * 17 + ( this.input["value"].split ( "\n" ).length - 1 ) * 18.85;
                        }

                    } else if ( this.output[x].type === "error" ) {

                        // Displays red output
                        displayOutput ( this.output[x].message, 7, 48 + x * 17, "red" );
                        displayUser ( this, 48 + ( x + 1 ) * 17 );

                    } else if ( this.output[x].type === "output" ) {

                        // Displays the white output
                        displayOutput ( this.output[x].message, 7, 48 + x * 17, "white" ); 
                        displayUser ( this, 48 + ( x + 1 ) * 17 );

                    } else if ( this.output[x].type === "file" ) {
                        
                        // Displays the purple output
                        displayOutput ( this.output[x].message, 7, 48 + x * 17, "purple" ); 
                        displayUser ( this, 48 + ( x + 1 ) * 17 );
                        
                    } else {

                        // Doesn't display anything due to a parsing error

                    }

                }

            }

            // Displays the terminal cursor
            displayCursor ( this );

            // Displays the current input value
            // Displays the input value
            fill ( colors.white );
            textFont ( ubuntuRegular );
            text ( this.input.value, 17 + textWidth ( this.user ) + textWidth ( ":" ) + textWidth ( this.location ) + textWidth ( "$" ), 48 + this.output.length * 17 );

        pop ();

    }

    navActionClicked ( mouseX, mouseY ) {

        push ();

            // Translates the origin point
            translate ( this.x, this.y );

            // Translates mouse coordinates
            mouseX = mouseX - this.x;   
            mouseY = mouseY - this.y;

            // CLOSE BUTTON -----------------------------------------------------------------------
 
            // Calculates corners
            const topLeftClose = createVector ( this.width - 15 - 13 / 2, 30 / 2 - 13 / 2 );
            const bottomLeftClose = createVector ( this.width - 15 - 13 / 2, 30 / 2 + 13 / 2 );
            const topRightClose = createVector ( this.width - 15 + 13 / 2, 30 / 2 - 13 / 2 );

            // Checks if the mouse is hovering the close button
            if ( ( bottomLeftClose.y > mouseY && mouseY > topLeftClose.y ) && 
                 ( topLeftClose.x < mouseX && mouseX < topRightClose.x ) ) {
                    console.log(`[STATUS]: Closing ${this.name} window`);
                    return "Close";
            }

            // MAX BUTTON -------------------------------------------------------------------------

            // Calculates corners
            const topLeftMax = createVector ( this.width - 32 - 13 / 2, 30 / 2 - 13 / 2 );
            const bottomLeftMax = createVector ( this.width - 32 - 13 / 2, 30 / 2 + 13 / 2 );
            const topRightMax = createVector ( this.width - 32 + 13 / 2, 30 / 2 - 13 / 2 );

            // Checks if the mouse is hovering the max button
            if ( ( bottomLeftMax.y > mouseY && mouseY > topLeftMax.y) &&
                 ( topLeftMax.x < mouseX && mouseX < topRightMax.x ) ) {
                    console.log(`[STATUS]: Maximizing ${this.name} window`);
                    return "Max";
            }

            // MIN BUTTON -------------------------------------------------------------------------

            // Calculates corners
            const topLeftMin = createVector ( this.width - 51 - 13 / 2, 30 / 2 - 13 / 2 );
            const bottomLeftMin = createVector ( this.width - 51 - 13 / 2, 30 / 2 + 13 / 2 );
            const topRightMin = createVector ( this.width - 51 + 13 / 2, 30 / 2 - 13 / 2 );

            // Checks if the mouse is hovering the max button
            if ( ( bottomLeftMin.y > mouseY && mouseY > topLeftMin.y) &&
                 ( topLeftMin.x < mouseX && mouseX < topRightMin.x ) ) {
                    console.log(`[STATUS]: Minimizing ${this.name} window`);
                    return "Min";
            }

        pop ();

        // If nothing was hovering, returns undefined
        return undefined;

    }

}