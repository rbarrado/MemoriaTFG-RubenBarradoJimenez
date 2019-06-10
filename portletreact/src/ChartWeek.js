import React from 'react';
import moment from 'moment';
import { Bar } from 'react-chartjs-2';

export default class extends React.Component {
	constructor(props) {
		super(props);
		this.state = {dayData: null, dataBar: null};
	}

	getWeatherState (weather) {
		const {id} = weather;
		if(id < 300) {
				return "Tormenta";
		}else if(id < 400) {
				return "Llovizna";
		}else if(id < 600) {
				return "Luvia";
		}else if(id < 700){
				return "Nieve";
		}else if(id < 800){
				return "Niebla";
		}else if(id === 800){
				return "Sol";
		}else if(id === 800){
				return "Sol";
		}else if(id === 801){
				return "Sol y nubes";   
		}else{
				return "Nublado";
		}
	};

	getTemp (kelvin) {
		return (kelvin - 273.15).toFixed(0);
    }

    getWind (num) {
		return (num*3.6).toFixed(2);
	}
    
	transformWeatherForecast (weather_data) {
		const {temp_min, temp_max, humidity} = weather_data.main;
		const temperature_min = this.getTemp(temp_min);
		const temperature_max = this.getTemp(temp_max);
        const {speed} = weather_data.wind;
        const wind = this.getWind(speed);
		const weatherState = this.getWeatherState(weather_data.weather[0]);

		const forecastData = {
				temperature_min,
				temperature_max,
				humidity,
				weatherState,
				wind
		}
		return forecastData;
	}

	transformForecast = (data) => (
		data.list.filter(item => (
			moment.unix(item.dt).utc().hour() === 3 ||
			moment.unix(item.dt).utc().hour() === 6 ||
			moment.unix(item.dt).utc().hour() === 9 ||
			moment.unix(item.dt).utc().hour() === 12 ||
			moment.unix(item.dt).utc().hour() === 15 ||
			moment.unix(item.dt).utc().hour() === 18 ||
			moment.unix(item.dt).utc().hour() === 21 ||
			moment.unix(item.dt).utc().hour() === 0
		)).map(item => (
            {
                weekDay: moment.unix(item.dt).format('dddd'),
                hour:  moment.unix(item.dt).utc().hour(),
                data: this.transformWeatherForecast(item),
            }
		))	
    );

	obtainDays(data) {
		let days = [];
		data.map((item) => {	
            days.push(item.weekDay);
			return days;
        });
        return days;
	};

	obtainDataDays(data) {
		let objectDay = [];
		var noesta = false;
		data.map((item) => {
			if(objectDay.length === 0){
				objectDay.push(item);
			}else{
				objectDay.map((item_day) => {
					if(item.weekDay.includes(item_day.weekDay)){
						if(parseFloat(item.data.temperature_max) > parseFloat(item_day.data.temperature_max)){
							item_day.data.temperature_max = item.data.temperature_max;
						}
						if(parseFloat(item.data.temperature_min) < parseFloat(item_day.data.temperature_min)){
							item_day.data.temperature_min = item.data.temperature_min;
						}
						noesta = false;
					}else{
						noesta = true;
						
					}
				});
				if(noesta){
					objectDay.push(item);
				}
				
            }
		});
		return objectDay;
	};
	

	obtainDatasets(data) {
		let object = [];
		let max = [];
		let min = [];
		data.map((item) => {
			max.push(item.data.temperature_max);
			min.push(item.data.temperature_min);
			return item;
		});
		object.push({
			label: 'Temperatura máxima',
			backgroundColor: '#D52B1A',
			borderWidth: 3,
			pointRadius: 4,
			data: max
		});
		object.push({
			label: 'Temperatura mínima',
			backgroundColor: '#6C6F70',
			borderWidth: 3,
			pointRadius: 4,
			data: min
		});
		return object
	};

	
	componentWillReceiveProps(city) {
		console.log("city");
		console.log(city);
		const api_key = "cf6b1fc1c9b7e2f6f5aa59ff2c25c965";
		const url = "http://api.openweathermap.org/data/2.5/forecast";
		const url_forecast = `${url}?q=${city.city}&appid=${api_key}`;

		fetch(url_forecast).then( resolve => {
			return resolve.json();
		}).then(forecastData => {
			let newWeather = this.transformForecast(forecastData);
			let weatherDay = this.obtainDataDays(newWeather);
            let dataBar = {
                labels: this.obtainDays(weatherDay),
                datasets: this.obtainDatasets(weatherDay)
            };
            this.setState({
                forecastData: forecastData,
                dataBar: dataBar
            });
		});
	}
		
	componentWillMount() {
		const api_key = "cf6b1fc1c9b7e2f6f5aa59ff2c25c965";
		const url = "http://api.openweathermap.org/data/2.5/forecast";
		const url_forecast = `${url}?q=${this.props.city}&appid=${api_key}`;

		fetch(url_forecast).then( resolve => {
			return resolve.json();
		}).then(forecastData => {
			let newWeather = this.transformForecast(forecastData);
			let weatherDay = this.obtainDataDays(newWeather);
            let dataBar = {
                labels: this.obtainDays(weatherDay),
                datasets: this.obtainDatasets(weatherDay)
            };
            this.setState({
                forecastData: forecastData,
                dataBar: dataBar
            });
		});
	}
		
	getOptionsBarMax(measureUnitEvo) {
		return {
			responsive: true,
			maintainAspectRatio: true,
				scales: {
					xAxes: [{
						barPercentage: 0.8,
						ticks: {
							fontFamily: 'flamasemibold',
							fontSize: 13,
							fontColor: '#8A8A8A'
						},
						gridLines: {
								display: false,
								color: '#000000',
								zeroLineColor: '#F2F2F1'
						}
					}],
					yAxes: [{
						gridLines: {
							drawBorder: false,
							color: '#F2F2F1'
						},
						ticks: {
							fontFamily: 'flamasemibold',
							fontSize: 13,
							fontColor: '#8A8A8A',
							beginAtZero: true,
							userCallback(item) {
								return `${item.toLocaleString()} ${measureUnitEvo}      `;
							}
						}
					}]
				},
			legend: {
				display: false
			}
		};
	}

	render() {
		return (
			<div>
                <div>
					<h3 style={{textAlign: 'center'}}>
						Temperatura semanal
					</h3>
        		</div>

				<div style={{ marginLeft: '25%', height: 'auto', width:'50%' }} id={'tooltip-Point-wrapper'}>
					<Bar
						id={'chart-Point'}
						width="800"
						height="350"
						data={this.state.dataBar}
						options={this.getOptionsBarMax('℃', this, this.state.dataBar)}
					/>
				</div>

			</div>
		);
	}	
}