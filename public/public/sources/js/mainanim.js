((PatternLock) => {document.addEventListener('DOMContentLoaded', () => {
  const AnimationCanvas = document.getElementById('animation-canvas');
  const AnimationCanvasContext = AnimationCanvas.getContext('2d');

  const AttackInterval = 2500;
  window.SiezeAttack = false;

  const Canvases = {
    animation: {
      canvas: document.getElementById('animation-canvas'),
      context: document.getElementById('animation-canvas').getContext('2d'),
    },

    controller: {
      canvas: document.getElementById('spell-grid'),
      context: document.getElementById('spell-grid').getContext('2d'),
    }
  };

  const SpellPatternController = new PatternLock({
    el: '#spell-grid',
    dimens: { width: Canvases.controller.canvas.width, height: Canvases.controller.canvas.height },
  });
  SpellPatternController.setTheme({
    accent: '#1abc9c',
    primary: '#000',
    bg: 'rgba(255,255,255,0)',
    dimens: {
      node_radius: 40,
    }
  });

  const ResizeCanvases = () => {
    Canvases.animation.canvas.width = window.innerWidth;
    Canvases.animation.canvas.height = window.innerHeight;

    Canvases.controller.canvas.width = (window.innerWidth < 768) ? window.innerWidth : window.innerWidth / 2;
    Canvases.controller.canvas.height = window.innerHeight / 2;

    // Clearing the Spell Grid:
    Canvases.controller.context.clearRect(0, 0, Canvases.controller.canvas.width, Canvases.controller.canvas.height);
    SpellPatternController.dimens = {
      width: Canvases.controller.canvas.width,
      height: Canvases.controller.canvas.height
    };
    SpellPatternController.generateGrid(2, 2);
    SpellPatternController.start();
  };

  window.addEventListener("resize", ResizeCanvases);
  ResizeCanvases();

  // Spell Grid:
  const The_Spells = {
     'shield': ['1243', '2134', '3124', '4213', '1342', '2431'],
     'basic attack': ['12', '13', '24', '34', '21', '31', '42', '43'],
     'super attack': ['1234', '2143', '1324', '4231', '4321', '3421', '3142', '2413'],
  };

  const patternToSequence = (pattern) => {
     let result = "";

     for (let index in pattern) {
        const node = pattern[index];

        if (node.row === 1) {
           if (node.col === 1) {
              result += "1";
           } else {
              result += "3";
           }
        } else {
           if (node.col === 1) {
              result += "2";
           } else {
              result += "4";
           }
        }
     }

     return result;
  };

  SpellPatternController.onPatternComplete = nodes => {
    const spell = patternToSequence(nodes);

    for (let spellName in The_Spells) {
      if (The_Spells[spellName].includes(spell)) {
        Canvases.controller.canvas.style.display = "none";

        switch (spellName) {
          case 'shield':
            startShieldAnimation();
            break;

          case 'super attack':
            superAttackAnimation();
            break;

          case 'basic attack':
            SimpleAttackDrawCircle(randNumInRange(50, 100));
            break;
        }

        setTimeout(function () {
          window.SiezeAttack = true;
          Canvases.controller.context.clearRect(0, 0, Canvases.controller.canvas.width, Canvases.controller.canvas.height);
          SpellPatternController.generateGrid(2, 2);
          SpellPatternController.start();
          Canvases.controller.canvas.style.display = "block";

          setTimeout(function () {
            window.SiezeAttack = false;
          }, 500);
        }, AttackInterval);
        return;
      }
    }
  };

})})(window.PatternLock);
