var processString = function(rules,string){
	var result = '';
	for(var i = 0; i < string.length; i++) {
		if(string[i - 1] == null){
			result = result + processNeighborhood(rules, '0' + string.substring(i,i + 2));
		} else if(string[i + 1] == null){
			result = result + '0';
		} else {
			result = result + processNeighborhood(rules,string.substring(i - 1,i + 2));
		}
	}
	return result;
}

var processNeighborhood = function(rules,neighborhood){
	for (var i = rules.patterns.length - 1; i >= 0; i--) {
		if(rules.patterns[i].current_state == neighborhood){
			return rules.patterns[i].new_state;
		}
	};
	return 0
}

var RuleSet = function(){
	this.patterns = new Array();
}

RuleSet.prototype.addPattern = function(pattern){
	this.patterns.push(pattern);
}

RuleSet.prototype.isFull = function(){
	return this.patterns.length > 7;
}

RuleSet.prototype.containsRule = function(rule) {
	for (var i = this.patterns.length - 1; i >= 0; i--) {
		if(comparePatterns(rule,this.patterns[i])){
			return true;
		} 
	};
	
	return false;
};

var comparePatterns = function(a,b){
	return a.current_state == b.current_state;
}

var Pattern = function(current_state, new_state){
	this.current_state = current_state;
	this.new_state = new_state;
}

var drawString = function(string, y_pos,size){
	for(var i = 0; i < string.length; i++) {
		var point = new Point((x_offset) + (i * (size)),y_pos);
		drawCell(string[i],point,size);
	}
}

var drawCell = function(state, position,size){
	var rect = new Path.Rectangle(position, size);
	rect.fillColor = (state == '1') ? 'black' : new Color(Math.random(), Math.random(), Math.random());
}

var getRandomRuleset = function(){
	var random_ruleset = new RuleSet();
		while(!random_ruleset.isFull()){
			var random_pattern = getRandomPattern();
			if(!random_ruleset.containsRule(random_pattern)){
				random_ruleset.addPattern(random_pattern);
			}
		}

		return random_ruleset;
}

var getRandomCurrentState = function(){
	var val = dec2Bin( Math.floor(Math.random() * 8)) + "";
	while(val.length < 3){
		val = "0".concat(val);
	}
	return val;
}

var getRandomNewState = function(){
	return (Math.random() > 0.5) ? "0" : "1";
}
var getRandomPattern = function(){
	return new Pattern(getRandomCurrentState(),getRandomNewState());
}


function dec2Bin(dec){
    return (dec >>> 0).toString(2);
}

paper.install(window);
paper.setup('oh');

var rules = getRandomRuleset();
var start_string = '0000000000000000000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000000000000000000000';
var x_offset = 0;
var counter = 1;
var size = 5;
var limit = 100;
view.onFrame = function(event) {
	if(counter < limit){
		 drawString(start_string, counter * (size),size);
			start_string = processString(rules, start_string);
		counter++;
	}
   
}
