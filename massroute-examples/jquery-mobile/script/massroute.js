(function(window){
    
    function MassRouteController( page, service ) {
        this.page = undefined;
        this.service = undefined;
        
        if( arguments.length ) {
            this._init( page, service );    
        }
    }
    
    MassRouteController.prototype = {
        _create: function() {
            //console.debug( "controller create" );
        },
        
        _show: function() {
            //console.debug( "controller show");
        },
        
        _hide: function() {
            //console.debug( "controller hide" );
        },
        
        _init: function( page, service ) {
            this.page = $(page);
            this.service = service;
            var $ref = this;
            this.page.bind( "pagecreate", function( event, ui ) { $ref._create(); } );
            this.page.bind( "pageshow", function( event, ui ) { $ref._show(); } );
            this.page.bind( "pagehide", function( event, ui ) { $ref._hide(); } );
        }
    };
    
    function RouteListController( page, service ) {
        var $ref = this;
        
        this.handleRouteListResult = function( result ) {
            var $list, $listParent;
            $list = $("#routes");
            $listParent = $list.parent();
            $list.detach();
            $(result).each( function() {
                $("#routeItemRenderer").tmpl( this )
                                        .appendTo( $list )
                                        .bind( "click", handleRouteSelection )
                                        .data( "route", this.tag )
                                        .buttonMarkup({
						wrapperEls: "div",
						shadow: false,
						corners: false,
						iconpos: "right",
						icon: "arrow-r",
                                                theme: "c"
					})
                                        .find( "div[class=\"ui-btn-inner\"]" )
                                        .addClass( "ui-li" )
            });
            $listParent.append( $list );
            $list.listview( "refresh" );
            $.fixedToolbars.show(true);
            $.mobile.hidePageLoadingMsg();
        };
        
        this.handleRouteListFault = function( fault ) {
            //console.debug( "Routes request fault: " + fault );
            $.mobile.hidePageLoadingMsg();
        };
        
        function handleRouteSelection( event ) {
            event.preventDefault();
            var id = $(this).data("route");
            $("#destination").data( "route", id );
            $.mobile.changePage( "#destination" );
            return false;
        }
        
        $ref._init( page, service );
    }
    RouteListController.prototype = new MassRouteController();
    RouteListController.prototype._create = function() {
        $.mobile.showPageLoadingMsg();
        this.service.getRoutes( {result:this.handleRouteListResult, fault:this.handleRouteListFault} );
    };
    
    function DestinationListController( page, service ) {
        var configuration;
        var $ref = this;
        
        this.showInbound = function() {
            $("#inboundButton").addClass("ui-btn-active");
            $("#outboundButton").removeClass("ui-btn-active");
            showDirection( "inbound" );
        };
        
        this.showOutbound = function() {
            $("#inboundButton").removeClass("ui-btn-active");
            $("#outboundButton").addClass("ui-btn-active");
            showDirection( "outbound" );
        };
        
        this.handleConfigurationResult = function( result ) {
            configuration = result;
            $ref.showInbound();
            $.mobile.hidePageLoadingMsg();
        };
        
        this.handleConfigurationFault = function( fault ) {
            //console.debug( "Configuration request fault: " + fault );
            $.mobile.hidePageLoadingMsg();
        };
        
        this.emptyList = function() {
            $ref.page.find("ul[data-role='listview'] li[data-destination!='*']").each( function( index, value ) {
               $(this).unbind( "click", handleDestinationSelection );
            });
            $("#destinations").empty();
        };
        
        function showDirection( direction ) {
            // Update title display.
            var route, destinations;
            route = $ref.service.getRouteById( $ref.page.data( "route" ) );
            if( route )
            {
                var element = $ref.page.find( "div[data-role='content'] p#titlefield" );
                $(element).html( "Select an " + direction + " destination along Route " + route.title + ":" );
            }
            // Get destinations based on direction.
            destinations = configuration.getDestinationsByType( direction );
            // Empty list.
            $ref.emptyList();
            // Fill list;
            $.each( destinations, function( index, value ) {
                $("#titleItemRenderer").tmpl( this )
                                        .appendTo( $("#destinations") )
                                        .bind( "click", handleDestinationSelection )
                                        .data( "destination", this.tag )
                                        .buttonMarkup({
						wrapperEls: "div",
						shadow: false,
						corners: false,
						iconpos: "right",
						icon: "arrow-r",
                                                theme: "c"
					})
                                        .find( "div[class=\"ui-btn-inner\"]" )
                                        .addClass( "ui-li" );
                $("#destinations").listview( "refresh" );
                $.fixedToolbars.show(true);
            });  
        }
        
        function handleDestinationSelection( event ) {
            event.preventDefault();
            var id = $(this).data("destination");
            $("#stop").data( "destination", id );
            $.mobile.changePage( "#stop" );
            return false;
        }
        
        $ref._init( page, service );
    }
    DestinationListController.prototype = new MassRouteController();
    DestinationListController.prototype._create = function() {
        $("#inboundButton").bind( "click", this.showInbound );
        $("#outboundButton").bind( "click", this.showOutbound );
    };
    DestinationListController.prototype._show = function() {
        var routeTag = this.page.data( "route" );
        if( routeTag ) {
            $.mobile.showPageLoadingMsg();
            this.service.getConfig( routeTag, {result:this.handleConfigurationResult, fault:this.handleConfigurationFault} );
        }
        else{
            $.mobile.changePage( "#home" );
        }
    };
    DestinationListController.prototype._hide = function() {
        this.emptyList();
        var element = this.page.find( "div[data-role='content'] p#titlefield" );
        $(element).html( "" );
    };
    
    function StopListController( page, service ) {
        var $ref = this;
        
        this.handleStopsResult = function( result /* RouteStop[] */ ) {
            var $list, $listParent;
            $list = $("#stops");
            $listParent = $list.parent();
            $list.detach();
            $(result).each( function() {
                $("#titleItemRenderer").tmpl( this )
                                        .appendTo( $list )
                                        .bind( "click", handleStopSelection )
                                        .data( "stop", this.tag )
                                        .buttonMarkup({
						wrapperEls: "div",
						shadow: false,
						corners: false,
						iconpos: "right",
						icon: "arrow-r",
                                                theme: "c"
					})
                                        .find( "div[class=\"ui-btn-inner\"]" )
                                        .addClass( "ui-li" )
            });
            $listParent.append( $list );
            $list.listview( "refresh" );
            $.fixedToolbars.show(true);
            $.mobile.hidePageLoadingMsg();
        };
        
        this.handleStopsFault = function( fault ) {
            //console.debug( "Stops request fault: " + fault );
            $.mobile.hidePageLoadingMsg();
        };
        
        this.emptyList = function() {
            if( this.listQueue !== undefined ) {
                this.listQueue.stop(true);
            }
            $ref.page.find("ul[data-role='listview'] li[data-stop!='*']").each( function( index, value ) {
               $(this).unbind( "click", handleStopSelection );
            });
            $("#stops").empty();
        };
        
        function handleStopSelection( event ) {
            event.preventDefault();
            var id = $(this).data("stop");
            $("#prediction").data( "stop", id );
            $.mobile.changePage( "#prediction" );
            return false;
        }
        
        $ref._init( page, service );
    }
    StopListController.prototype = new MassRouteController();
    StopListController.prototype._show = function() {
        var destinationTag = this.page.data( "destination" );
        if( destinationTag ) {
            $.mobile.showPageLoadingMsg();
            var destination = this.service.getDestinationById( destinationTag );
            var element = this.page.find( "div[data-role='content'] p#titlefield" );
            $(element).html( "Select a stop along " + destination.title + ":" );
            this.service.getStops( destinationTag, {result:this.handleStopsResult, fault:this.handleStopsFault} );
        }
        else{
            $.mobile.changePage( "#home" );
        }
    };
    StopListController.prototype._hide = function() {
        this.emptyList();
        var element = this.page.find( "div[data-role='content'] p#titlefield" );
        $(element).html( "" );
    };
    
    var PredictionListController = function( page, service ) {
        var $ref = this;
        
        this.handlePredictionsResult = function( result /* StopPrediction[] */ ) {
            if( result === null || result.length === 0 ) {
                $("#readOnlyTitleItemRenderer").tmpl( {title:"No predictions found. Please try again at a later time."} )
                                                .appendTo( $("#predictions") );
            }
            else{
                $.each( result, function( index, value ) {
                    var timeStr = getTimeStr( value );
                    $("#readOnlyTitleItemRenderer").tmpl( {title:timeStr} )
                                                    .appendTo( $("#predictions") );
                });    
            }
            $("#predictions").listview( "refresh" );
            $.fixedToolbars.show(true);
            $.mobile.hidePageLoadingMsg();
        };
        
        this.handlePredictionsFault = function( fault ) {
            //console.debug( "Predictions request fault: " + fault );
            $.mobile.hidePageLoadingMsg();
        };
        
        this.handleRefresh = function( event ) {
            $.mobile.showPageLoadingMsg();
            event.preventDefault();
            $ref.emptyList();
            $ref.service.getPredictions( $ref.page.data( "stop" ), {result:$ref.handlePredictionsResult, fault:$ref.handlePredictionsFault} );
            return false;
        };
        
        this.emptyList = function() {
            $("#predictions").empty();
        };
        
        function getTimeStr( value /* StopPrediction */ ) {
            var secs, mins, hrs, text;
            secs = Math.round( value.seconds % 60 );
            mins = Math.floor( ( value.seconds / 60 ) % 60 );
            hrs = Math.floor( value.seconds / 3600 );
            text = "";
            if( hrs > 0 )
            {
                    text += hrs.toString() + " hour" + ( (hrs > 1 ) ? "s" : "" );
            }
            if( mins > 0 )
            {
                    if( text.length > 0 ) {
                        text += " ";
                    }
                    text += mins.toString() + " minute" + ( (mins > 1) ? "s" : "" );
            }
            if( secs > 1 )
            {
                    if( text.length > 0 ) {
                        text += " ";
                    }
                    text += secs.toString() + " seconds";
            }
            return text;
        }
        
        $ref._init( page, service );
    }
    PredictionListController.prototype = new MassRouteController();
    PredictionListController.prototype._show = function() {
        var stopTag = this.page.data( "stop" );
        if( stopTag ) {
            $.mobile.showPageLoadingMsg();
            var stop = this.service.getStopById( stopTag );
            var element = this.page.find( "div[data-role='content'] p#titlefield" );
            $(element).html( "Next arrival times for " + stop.title + ":" );
            this.service.getPredictions( stopTag, {result:this.handlePredictionsResult, fault:this.handlePredictionsFault} );
            this.page.find("#refreshbutton").bind( "click", this.handleRefresh );
        }
        else {
            $.mobile.changePage( "#home" );
        }
        
    };
    PredictionListController.prototype._hide = function() {
        this.emptyList();
        this.page.find("#refreshbutton").unbind( "click", this.handleRefresh );
        var element = this.page.find( "div[data-role='content'] p#titlefield" );
        $(element).html( "" );
    };
    
    window.MassRouteController = MassRouteController;
    window.RouteListController = RouteListController;
    window.DestinationListController = DestinationListController;
    window.StopListController = StopListController;
    window.PredictionListController = PredictionListController;
    
    new RouteListController( $("#home"), $.massroute );
    new DestinationListController( $("#destination"), $.massroute );
    new StopListController( $("#stop"), $.massroute );
    new PredictionListController( $("#prediction"), $.massroute );
    
})(window);