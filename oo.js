document.addEventListener('DOMContentLoaded', function() {
    const objectInput = document.getElementById('object-input');
    const generateButton = document.getElementById('generate-button');
    const outputSection = document.getElementById('output-section');
    const gamesContainer = document.getElementById('games-container');

    // This array will now live outside the click function, acting as our long-term memory.
    let recentlyUsedGames = [];
    // We'll set a limit to how many games we remember, so we don't run out of ideas forever.
    const RECENT_MEMORY_LIMIT = 15;

    // The database of game ideas is unchanged.
    const gameIdeas = {
        'book': { name: "Book Balance", description: "Balance the book on your head and walk in a straight line for as long as you can. For an extra challenge, try walking up and down a small step!" },
        'stone': { name: "Stone Precision Toss", description: "Set up a target on the floor (like a piece of paper). Take five steps back and try to toss the stone as close to the center of the target as possible." },
        'pillow': { name: "Pillow Put", description: "Hold the pillow under your chin with one hand. Without moving your feet, see how far you can 'put' (push) the pillow. Measure your best of three attempts!" },
        'sock': { name: "The Sock-et Toss", description: "Roll the sock into a ball. Set up a laundry basket or a bucket as a target and see how many times you can score in a minute." },
        'bottle': { name: "Water Bottle Bowling", description: "Set up an empty plastic bottle as a bowling pin. Roll a small ball (or a rolled-up sock) and try to knock it over from a distance." },
        'pen': { name: "Pen Javelin", description: "Find an open space. Hold the pen like a javelin and see how far you can throw it. Make sure the area is clear of people and fragile items!" },
        'key': { name: "Key-hole Challenge", description: "Set a cup on its side on a table. From a few feet away, slide the key and try to get it to land inside the cup." },
        'coin': { name: "Coin Spin Championship", description: "Who can spin a coin for the longest time? Time your spins and challenge a friend!" },
        'aluminum foil': { name: "Foil Sculpture Contest", description: "You have 60 seconds to create the best-looking animal or object out of a single piece of aluminum foil. Go!" },
        'balloon': { name: "Endless Keep-It-Up", description: "Don't let the balloon touch the floor! For an expert challenge, you can only use your head or your feet." },
        'ball': { name: "Wall Bounce Rally", description: "How many times can you bounce the ball off a wall and catch it without it hitting the ground? Count your highest rally." },
        'binder clip': { name: "Binder Clip Catapult", description: "Use the clip's spring to launch a small, wadded-up piece of paper at a target, like a trash can or a mug." },
        'blanket': { name: "Flash Fort", description: "You have two minutes to build the most epic blanket fort you can. It must be able to fit you inside!" },
        'bottle cap': { name: "Tabletop Flick-Football", description: "Set up 'goalposts' with your fingers at the end of a table and flick the bottle cap to score a field goal." },
        'bowl': { name: "Coin Ricochet Master", description: "Try to bounce a coin once on the table so that it lands inside the bowl. It's harder than it sounds!" },
        'bucket': { name: "The Long Toss", description: "Set the bucket down and take ten big steps away. How many small items (like rolled-up socks) can you land in the bucket out of ten tries?" },
        'candle': { name: "Candle Curling", description: "(Use an unlit candle!) On a smooth, flat surface, slide the candle and try to get it to stop inside a designated target zone." },
        'can': { name: "Can Knockdown", description: "Stack a few empty cans into a pyramid. From a distance, use a rolled-up sock to try and knock them all down in one throw." },
        'cards': { name: "Skyscraper of Cards", description: "How many levels high can you build a house of cards before it all comes tumbling down?" },
        'chalk': { name: "Sidewalk Long Jump", description: "Draw a starting line with the chalk. From a standing position, see how far you can jump and mark your landing spot. Beat your own record!" },
        'clothespin': { name: "Precision Drop", description: "Stand on a chair (safely!) and try to drop a clothespin into the narrow opening of a bottle placed below you." },
        'coaster': { name: "Coaster Skim", description: "On a smooth table, see how close you can slide a coaster to the opposite edge without it falling off. A game of inches!" },
        'comb': { name: "Comb Kazoo Orchestra", description: "Place a piece of paper (like wax paper) over the comb and hum into it to create your own musical instrument." },
        'cushion': { name: "The Floor is Lava", description: "Place all your cushions and pillows on the floor as 'islands.' You must cross the room by only stepping on your islands!" },
        'dice': { name: "The Dice-y Tower", description: "How many dice can you stack directly on top of each other before your tower falls? Requires a steady hand!" },
        'envelope': { name: "Paper Plane Postal Service", description: "Make a paper airplane out of the envelope. Your mission is to land it inside a designated 'mailbox' (like a box or a laundry basket)." },
        'eraser': { name: "Tabletop Eraser Golf", description: "Set up a 'hole' (like a cup on its side). Flick an eraser across the table, trying to get it in the hole in the fewest number of strokes." },
        'feather': { name: "Feather Float Challenge", description: "Keep the feather in the air for as long as possible using only your own breath. No hands allowed!" },
        'fork': { name: "Balancing Act", description: "Can you balance a fork on the tip of your finger? For a pro-move, try balancing it on the rim of a glass." },
        'frisbee': { name: "Frisbee Golf", description: "Pick a target in the distance (like a tree or a lamp post). How many throws does it take for your frisbee to hit the target?" },
        'hanger': { name: "The Hanger Hook", description: "Without using your hands, try to pick up a t-shirt from the floor using only the clothes hanger." },
        'hair tie': { name: "Hair Tie Archery", description: "Carefully stretch a hair tie between your thumb and index finger and use it to launch a tiny paper ball at a target." },
        'ice cube': { name: "Ice Cube Melt-Down", description: "A race against time! Who can melt an ice cube completely in their hands the fastest? (Warning: It gets cold!)" },
        'magazine': { name: "Magazine Roll-Up", description: "Roll a magazine up as tightly as you possibly can. Test its strength. Can you bend your super-tightly-rolled magazine?" },
        'marble': { name: "Marble Run Architect", description: "Create a maze or a run on the floor using books, rulers, and other objects. Release the marble and see if it makes it to the end." },
        'mirror': { name: "Light Beam Target Practice", description: "Use the mirror to reflect a beam of light (from the sun or a flashlight) onto a specific target on the wall. Hold it steady!" },
        'mug': { name: "The Mug Flip", description: "Try to flip a sturdy mug and have it land upright on the table. (Maybe practice over a soft surface first!)" },
        'paperclip': { name: "One-Minute Chain", description: "How long of a paperclip chain can you possibly make in just 60 seconds?" },
        'paper towel': { name: "The Unbreakable Bridge", description: "Can you design a bridge using a single paper towel sheet between two books that can support the weight of a coin?" },
        'plate': { name: "Plate Spinning", description: "(Use a plastic plate!) Try to spin the plate on the tip of your finger. How long can you keep it going?" },
        'ruler': { name: "Ruler Drop Reflex Test", description: "Have a friend hold a ruler at the top edge. Place your fingers at the 0 mark, and when they drop it, see how quickly you can catch it. Note the measurement!"},
        'shoe': { name: "The Shoe Flip", description: "Place your foot in your shoe, and with a single kicking motion, try to make the shoe flip in the air and land perfectly upright." },
        'sponge': { name: "Sponge Skyscraper", description: "(Use dry sponges!) The squishiness makes them unstable. How high can you stack sponges before they topple over?" },
        'spoon': { name: "Spoon Catapult", description: "Place a spoon on the edge of a table, put a small item (like a sugar cube) on the end, and tap the handle to launch it! Try to land it in a cup." },
        'sticky note': { name: "Sticky Note Archery", description: "Stick one note on a wall as a target. From a distance, try to throw other sticky notes to get them as close to the target as possible." },
        'string': { name: "Knot-Tying Ninja", description: "How many different types of knots can you successfully tie (and untie) in one minute? Look up some examples online!" },
        'tape': { name: "Tape Sculpture Artist", description: "Using only a roll of tape, create a freestanding 3D sculpture. You can't use any other objects for support!" },
        'tea bag': { name: "The Tea Bag Hookshot", description: "A game of pure skill. Try to throw a dry tea bag (by the string) so that the tag hooks over the rim of a mug." },
        'thumbtack': { name: "Thumbtack Darts", description: "Draw a target on a piece of paper and pin it to a corkboard. From a safe distance, throw thumbtacks like darts to score points. (Adult supervision recommended!)" },
        'tissue box': { name: "Tissue Box Monster Walk", description: "If the box is empty, put one on each foot like giant shoes and try to stomp around the room." },
        'towel': { name: "Towel Whip", description: "Roll up a towel tightly. Set up an empty plastic bottle and, from a safe distance, see if you can knock it over by whipping the towel at it." },
        'twig': { name: "Mini Pick-Up Sticks", description: "Drop a handful of small twigs or sticks into a pile. Try to remove them one by one without causing any of the other sticks to move." },
        'wallet': { name: "Credit Card Flick", description: "(Use an old gift card or library card!) See if you can accurately flick the card from a distance to land inside a hat or a box." },
        'default': { name: "The Ultimate Object Stack", description: "A true test of creativity. How high can you stack ALL of your objects? The tower must stand on its own for 10 seconds to count!" }
    };

    generateButton.addEventListener('click', function() {
        const objects = objectInput.value.split(',').map(item => item.trim().toLowerCase()).filter(item => item);
        if (objects.length === 0) {
            alert('Please enter at least one object.');
            return;
        }

        gamesContainer.innerHTML = '';
        outputSection.classList.remove('hidden');

        // This Set is still used to prevent duplicates within this *single* generation.
        const gamesForThisRound = new Set();

        objects.forEach(object => {
            let game = null;
            for (const key in gameIdeas) {
                if (object.includes(key) && key !== 'default') {
                    game = gameIdeas[key];
                    break;
                }
            }
            
            // If a game is found for the object, check if it's been used recently.
            if (game && !recentlyUsedGames.includes(game.name)) {
                gamesForThisRound.add(game);
            }
        });

        // If after checking all objects, we have NO new games, add the default one as a fallback.
        if (gamesForThisRound.size === 0) {
            gamesForThisRound.add(gameIdeas.default);
        }

        // Now, display the games we've selected for this round.
        gamesForThisRound.forEach(game => {
            const gameElement = document.createElement('div');
            gameElement.className = 'game';
            gameElement.innerHTML = `<h3>${game.name}</h3><p>${game.description}</p>`;
            gamesContainer.appendChild(gameElement);

            // IMPORTANT: Add the newly shown game to our long-term memory.
            recentlyUsedGames.push(game.name);
        });
        
        // Add the combo challenge if we ended up showing more than one game.
        if (gamesForThisRound.size > 1) {
            const comboGame = document.createElement('div');
            comboGame.className = 'game';
            comboGame.innerHTML = `<h3>The Grand Combo Challenge</h3><p>Use all of your objects together in one epic final event! How can you combine them into a single, creative game?</p>`;
            gamesContainer.appendChild(comboGame);
        }

        // IMPORTANT: Trim the memory queue if it gets too long.
        // This makes the website "forget" the oldest games to make room for new ones.
        while (recentlyUsedGames.length > RECENT_MEMORY_LIMIT) {
            recentlyUsedGames.shift(); // .shift() removes the oldest item from the start of the array.
        }
    });
});