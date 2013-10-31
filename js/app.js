App = Ember.Application.create();

App.Router.map(function() {
  this.resource('team', { path: ':team_id' })
});

App.IndexRoute = Ember.Route.extend({
  model: function() {
    return $.getJSON("http://api.espn.com/v1/sports/basketball/nba/teams?apikey=8vmchqccs8bhrr6qvgcbfpjx").then(function(data){
       	var teams = []; 
    	_.each(data.sports[0].leagues[0].teams, function(team){
    		teams.push({
    			name: team.location + " " + team.name,
    			imgsrc: team.logos.large.href,
    			id: team.id
    		}); 
    	});
    	return _.sortBy(teams, function(team){ return team.name});
    });
  }
});

App.Team = DS.Model.extend();

App.TeamRoute = Ember.Route.extend({

	setupController: function (controller, model) {
		controller.set("model", null);
        var team;
        $.getJSON("http://api.espn.com/v1/sports/basketball/nba/teams/" + model.id + "?apikey=8vmchqccs8bhrr6qvgcbfpjx", function (data) {
			var result = data.sports[0].leagues[0].teams[0];
	       	team = {
	       		name: result.location + " " + result.name,
	       		imgsrc: result.logos.large.href,
	       		record: result.record.wins + " - " + result.record.losses,
	       		headerColor: "background-color:#" + result.color,
	       		newsApi: result.links.api.news.href,
	       		espnLink: result.links.web.teams.href,
	       		mobileLink: result.links.mobile.teams.href
	       	}; 
	       	$.getJSON(team.newsApi + "?apikey=8vmchqccs8bhrr6qvgcbfpjx", function(newsData){
	    		team.links = [];
	    		_.each(newsData.headlines, function(headline){
	    			team.links.push({
	    				text: headline.headline,
	    				web: headline.links.web.href,
	    				mobile: headline.links.mobile.href
	    			});
	    		});
	    		controller.set("model", team);
	    	});
	       	
        });
    },

    model: function(params){
    	//pass id into setupController logic (only called on page refreshes)
    	return {
    		id: params.team_id
    	};
    }
});
