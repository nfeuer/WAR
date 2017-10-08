((PatternLock) => {
	document.addEventListener('DOMContentLoaded', () => {
		const cnvs = document.getElementById('animation-canvas');
		cnvs.width = (window.innerWidth < 768) ? window.innerWidth : window.innerWidth / 2;
		cnvs.height = window.innerHeight / 2;

		const patternLock = new PatternLock({
			el: '#spell-grid',
			dimens: { width: cnvs.width, height: cnvs.height },
		});

		window.lockGrid = patternLock;
		window.lockCanvas = document.getElementById('spell-grid').getContext('2d');

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

		patternLock.setTheme({
			accent: '#1abc9c',
         primary: '#000',
         bg: 'rgba(255,255,255,0)',
			dimens: {
				node_radius: 40,
			}
		});

		// patternLock.generateGrid(3, 3);
    patternLock.generateGrid(2, 2);
		patternLock.start();

		patternLock.onPatternComplete = nodes => {
			const spell = patternToSequence(nodes);

			for (let spellName in The_Spells) {
	      if (The_Spells[spellName].includes(spell)) {
	         if (spellName === 'shield') {
	            startShieldAnimation();
							setTimeout(function () { AnimationStop = true; }, AttackInterval+1000);
							setTimeout(function () { AnimationStop = false; }, AttackInterval + 1500);
	            return;
	         }

					 if (spellName === 'super attack') {
	            superAttackAnimation();
							setTimeout(function () { AnimationStop = true; }, AttackInterval);
							setTimeout(function () { AnimationStop = false; }, AttackInterval + 500);
							return;
	         }

					 SimpleAttackDrawCircle(randNumInRange(40, 100));
					 setTimeout(function () { AnimationStop = true; }, AttackInterval);
					 setTimeout(function () { AnimationStop = false; }, AttackInterval + 500);
	         return;
	      }
      }
		};
	});

})(window.PatternLock);
