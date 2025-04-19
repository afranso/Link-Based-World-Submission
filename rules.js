class Start extends Scene {
    create() {
        this.engine.setTitle(this.engine.storyData.Title);
        this.engine.keycard = false;
        this.engine.lightNumber = 0; // Initialize light state
        this.engine.addChoice("Wake Up");
    }

    handleChoice() {
        this.engine.gotoScene(Location, this.engine.storyData.InitialLocation);
    }
}

class Location extends Scene {
    create(key) {
        this.currentLocationKey = key;
        let locationData = this.engine.storyData.Locations[key];

        this.engine.show(`You are in: <strong>${key}</strong><br>`);
        this.engine.show(locationData.Body);

        // Special interaction for Escape Pods if keycard is present
        if (key === "Escape Pods" && this.engine.keycard) {
            this.engine.addChoice("Unlock door", {
                Text: "Unlock door",
                Target: "Unlocked Door"
            });
        }

        // Add regular choices
        if (locationData.Choices) {
            for (let choice of locationData.Choices) {
                this.engine.addChoice(choice.Text, choice);
            }
        }

        // Add Light Room button interaction
        if (key === "Light Room") {
            this.engine.addChoice("Press Button", {
                Text: "Press Button",
                Target: "Light Room" // Reload the same scene
            });
        }

        // End fallback
        if (!locationData.Choices && key !== "Unlocked Door") {
            this.engine.addChoice("The end.");
        }
    }

    handleChoice(choice) {
        if (choice) {
            this.engine.show("&gt; " + choice.Text);

            // Grab Keycard logic
            if (choice.Text === "Grab Keycard") {
                this.engine.keycard = true;
            }

            // Light Room interaction
            if (this.currentLocationKey === "Light Room" && choice.Text === "Press Button") {
                if (this.engine.lightNumber === 0) {
                    this.engine.show("The room is colored <span style='color:red;'>red</span>.");
                } else {
                    this.engine.show("The room is colored <span style='color:blue;'>blue</span>.");
                }
                this.engine.lightNumber = (this.engine.lightNumber + 1) % 2;

                // Stay in the Light Room after pressing the button
                this.engine.gotoScene(Location, "Light Room");
                return;
            }

            // Go to next scene
            this.engine.gotoScene(Location, choice.Target);
        } else {
            this.engine.gotoScene(End);
        }
    }
}

class End extends Scene {
    create() {
        this.engine.show("<hr>");
        this.engine.show(this.engine.storyData.Credits);
    }
}

Engine.load(Start, 'myStory.json');
