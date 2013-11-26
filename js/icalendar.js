;(function($) {
	$.extend({
		iCancelEvent: function(ev)
		{
			if(ev.stopPropagation) ev.stopPropagation();else ev.cancelBubble = true;if(ev.preventDefault) ev.preventDefault();else ev.returnValue = false;return false;
		}
	});

$.widget('my.iCalendar',{
	options: {
		lang: "ru",
		years: [2010,2020],
		year: (new Date()).getFullYear(),
		day: (new Date()).getDate(),
		month: ((new Date()).getMonth()+1)

	},
	markCurDay: function()
	{
		var obj1 = $("#days-container"+this.gid+" > div.days-scroll");
		obj1.find("a.cur-day").toggleClass("cur-day");
		obj1.find("#pic-day-"+this.options.day+"-"+this.options.month+"-"+this.options.year+this.gid).toggleClass("cur-day");
	},
	pickDay: function(d,m)
	{
		var v = ((d<10)?("0"+d):(d))+"."+((m<10)?("0"+m):(m))+"."+this.options.year;
		this.inputEl.val(v);
		var obj1 = $("#icalendar-container"+this.gid).data("widget");
		obj1.options.day = d;
		obj1.options.month = m;
		obj1.markCurDay();
		obj1.hidewidget();
	},
	getYear: function(y){
		this.year = y;
		this.isLeap = (y%4==0 && (y%100!=0 || y%400==0))?true:false;
		this.dim = [31,(this.isLeap)?(29):(28),31,30,31,30,31,31,30,31,30,31];

		var ret = "<ul class='year-list'>";
		for(var i=this.options.years[0];i<=this.options.years[1];i++)
			ret += "<li class='year-item'>"+i+"</li>";
		ret+="</ul>";
		return ret;
	},
	refresh: function(){
		this.elleft = this.element.offset().left;
		this.eltop = this.element.offset().top;
		this.elwidth = this.element.width();
		this.elheight = this.element.height();

		this.wwidth = this.divid.width();
		this.wheight = this.divid.height();

		var dc = $(document);

		var obj1 = $("#icalendar-container"+this.gid);

		if((this.elleft + this.wwidth+20)>dc.width())
		{
			this.wleft = dc.width() - this.wwidth-20;
		}else
		{
			this.wleft = this.elleft;
		}
		if((this.eltop)>(this.wheight+10))
		{
			this.wtop = this.eltop - this.wheight-this.elheight+5;
		}else
		{
			this.wtop = this.eltop + this.elheight+5;
		}
		this.divid.css("left",this.wleft).css("top",this.wtop);

		this.showwidget();

		var offx = Math.round(($("#year-container"+this.gid).height()-$("#year-dragger"+this.gid).height())/2);

		var tt1 = (offx+$("#icalendar-container"+this.gid).position().top+$("#year-container"+this.gid).position().top+$("#year-dragger"+this.gid).height()-$("#year-scroll"+this.gid).height());
		var tt2 = offx+$("#icalendar-container"+this.gid).position().top+$("#year-container"+this.gid).position().top+$("#year-dragger"+this.gid).height();
		$("#year-scroll"+this.gid).draggable("option","containment", [0,tt1,100,tt2]);
		this.markCurDay();

	},
	hidewidget: function() {
		this.divid.hide();
	},
	showwidget: function() {
		this.divid.show();
	},
	getDaysNames: function(){
		return "<ul class='days-names'><li class='day-name'>"+this.options.diw[0]+"</li><li class='day-name'>"+this.options.diw[1]+"</li><li class='day-name'>"+this.options.diw[2]+"</li><li class='day-name'>"+this.options.diw[3]+"</li><li class='day-name'>"+this.options.diw[4]+"</li><li class='day-name day-name-weekend'>"+this.options.diw[5]+"</li><li class='day-name day-name-weekend'>"+this.options.diw[6]+"</li></ul>";
	},
	getMonth: function(){
		var ret="<ul class='month-list'>";
		for(var i=0;i<12;i++)
			ret +="<li class='month-item'>"+this.options.mnm[i]+"</li>";
		ret += "</ul>";
		return ret;
	},
	getPicDays: function(){
		this.dim = [31,(this.year%4==0 && (this.year%100!=0 || this.year%400==0))?(29):(28),31,30,31,30,31,31,30,31,30,31];
		var cDate = new Date(this.options.year,1,1,0,0,0,0);
		var ret = "<table border='0' cellpadding='0' cellspacing='1' width='100%'>";
		for(var i=0;i<12;i++)
		{
			ret += "<tr><td colspan='7' align='left'><br/><span class='month-name'>"+this.options.mnm[i]+"</span></td></tr><tr>";
			var cm = new Date(this.options.year,i,0,0,0,0,0);
			var fd = cm.getDay();
			if(fd==0)fd=7;
			fd-=1;
			for(var n=0;n<fd;n++)
				ret += "<td align='center' valign='middle'><span class='day-picker'> </span></td>";
			for(var n=0;n<this.dim[i];n++)
			{
				if((n+fd)%7==0 && n!=this.dim[i] && n!=0)ret+="</tr><tr>";
				var dtmp = new Date(this.options.year,i,n).getDay();
				if(dtmp == 6 || dtmp==0)
					ret +="<td align='center' valign='middle'><a link='' class='day-picker day-name-weekend' onmouseover='$(this).parent().toggleClass(\"tdmouseover\")' onmouseout='$(this).parent().toggleClass(\"tdmouseover\")' onclick='$(\"#icalendar-container"+this.gid+"\").data(\"widget\").pickDay("+(n+1)+","+(i+1)+")' id='pic-day-"+(n+1)+"-"+(i+1)+"-"+this.options.year+this.gid+"'>"+(n+1)+"</a></td>";
				else
					ret +="<td align='center' valign='middle'><a link='' class='day-picker'  onmouseover='$(this).parent().toggleClass(\"tdmouseover\")' onmouseout='$(this).parent().toggleClass(\"tdmouseover\")' onclick='$(\"#icalendar-container"+this.gid+"\").data(\"widget\").pickDay("+(n+1)+","+(i+1)+")' id='pic-day-"+(n+1)+"-"+(i+1)+"-"+this.options.year+this.gid+"'>"+(n+1)+"</a></td>";
			}
			if((n+fd)%7!=0)for(var k=0;k<(7-(n+fd)%7);k++)ret+="<td align='center' valign='middle'><span class='day-picker'> </span></td>";
			ret+="</tr>";
		}
		ret+="</table>";
		return ret;
	},
	isLeap: function(y){
		if(y%4==0 && (y%100!=0 || y%400==0))return true;return false;
	},
	_create: function() {

		switch(this.options.lang)
		{
			case 'ru':
				this.options.mnm = ['январь','февраль','март','апрель','май','июнь','июль','август','сентябрь','октябрь','ноябрь','декабрь'];
				this.options.diw = ['ПН','ВТ','СР','ЧТ','ПТ','СБ','ВС'];
			break;
			default:
				this.options.mnm = ['january','february','march','april','may','june','july','august','september','october','november','december'];
				this.options.diw = ['MO','TU','WE','TH','FR','SA','SU'];
			break;
		};

		

			// Количество дней в каждом из месяцев текущего года
			this.dim = [31,(this.isLeap(this.year))?(29):(28),31,30,31,30,31,31,30,31,30,31];

		this.inputEl = this.element;

		var dtmp = new Date();
		this.containerID = dtmp.getMinutes() + "" + dtmp.getSeconds()+""+dtmp.getMilliseconds() + "" + Math.round(Math.random()*1000);

		var body = document.body,
		div = body.appendChild(div=document.createElement( "div" ));
		div.id = "icalendar-containercont"+this.containerID;

		this.gid = "cont"+this.containerID;
		this.divid = $("#"+div.id);

		this.divid.toggleClass("icalendar-container");
		this.divid.append("<table border='0' cellpadding='0' cellspacing='0' width='100%'><tr><td valign='top' align='center'>"+this.getDaysNames()+"</td><td valign='top' colspan='2'>&nbsp;</td></tr><tr><td valign='top'><div id='days-container"+this.gid+"' class='days-container'><div class='days-scroll'>"+this.getPicDays()+"</div></div></td><td valign='top'><div id='month-container"+this.gid+"' class='month-container'><div class='month-scroll'>"+this.getMonth()+"</div><div id='month-dragger"+this.gid+"' class='month-dragger'></div><div id='month-dragger-bg"+this.gid+"' class='month-dragger-bg'></div></div></td><td valign='top'><div id='year-container"+this.gid+"' class='year-container'><div class='year-scroll' id='year-scroll"+this.gid+"'>"+this.getYear(this.options.year)+"</div><div id='year-dragger"+this.gid+"' class='year-dragger'></div><div id='year-dragger-bg"+this.gid+"' class='year-dragger-bg'></div></div></td></tr></table>");



				var offx = Math.round(($("#year-container"+this.gid).height()-$("#year-dragger"+this.gid).height())/2);
				$("#year-dragger"+this.gid).css('top',offx);
				$("#year-dragger-bg"+this.gid).css('top',offx);
				$("#year-scroll"+this.gid).css('top',offx);

				$("#year-scroll"+this.gid).draggable({axis: 'y',grid: [$("#year-dragger"+this.gid).height(),$("#year-dragger"+this.gid).height()], stop: function(ev,ui){
					var gid = (this.id+"").replace("year-scroll","");
					var obj1 = $("#year-dragger"+gid);
					var obj2 = $("#year-scroll"+gid);
					var obj3 = $("#year-container"+gid);
					var obj4 = obj3.find('div.year-scroll > ul');
					var ind = (Math.round((obj1.offset().top - obj2.offset().top)/obj1.height()))
					
					obj4 = obj4.find('li:eq('+ind+')');
					obj1 = $("#icalendar-container"+gid).data("widget");
					obj1.options.year = obj4.html();
					obj2 = $("#days-container"+gid+" > div.days-scroll");
					obj2.html("");
					obj2.append(obj1.getPicDays());
				}});


				$("#month-dragger"+this.gid).draggable({axis: 'y',containment: 'parent', drag: function(ev,ui){
					var gid = (this.id+"").replace("month-dragger","");
					var obj1 = $("#month-dragger"+gid);
					var obj2 = $("#month-dragger-bg"+gid);
					var obj3 = $("#days-container"+gid+" > div.days-scroll");
					var obj4 = $("#month-container"+gid);

					var dHeight = obj3.height();
					var sHeight = obj1.height();
					var mHeight = obj4.height();
					var tHeight = obj3.parent().height();

				
					var k = (dHeight-tHeight+10) / (mHeight-sHeight);

					
					obj2.css('top',obj1.position().top);
					//alert(obj1.position().top);
					obj3.css('top',Math.round(-obj1.position().top*k));
					//alert(Math.round(-obj1.offset().top*k));
				}});





		var obj1 = $("#year-dragger"+this.gid);
		var obj2 = $("#year-scroll"+this.gid);
		var ind = this.options.year - this.options.years[0];
		obj2.css('top',obj2.position().top-ind*obj1.height());


		this.hidewidget();

		this.element.data("widget",this.gid);
		$("#icalendar-container"+this.gid).data("widget",this);


		this.element.bind("click, focus", function(ev){
			var gid = $(this).data("widget");
			$("#icalendar-container"+gid).data("widget").refresh();
		});
		
		this.element.bind("blur", function(ev){
			var gid = $(this).data("widget");
			setTimeout(function(){
				$("#icalendar-container"+gid).hide();
			},300);
		});
	}
});

})(jQuery);
