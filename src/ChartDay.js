import React from 'react';
import moment from 'moment';
import { Bar } from 'react-chartjs-2';
import { Line } from 'react-chartjs-2';
import { HorizontalBar } from 'react-chartjs-2';

export default class extends React.Component {
	constructor(props) {
		super(props);
		this.state = {dayData: null, dataTemp: null, dataWind: null, dataHumidity: null};
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

	getCurrentDate(){
		var today = new Date();
		var weekday = new Array('Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday');
		var dayOfWeek = weekday[today.getDay()];
		return dayOfWeek;
	}

	transformWeatherDay (weather_data) {
		const {temp, humidity} = weather_data.main;
		const temperature = this.getTemp(temp);
		const {speed} = weather_data.wind;
		const wind = this.getWind(speed);
		const weatherState = this.getWeatherState(weather_data.weather[0]);

		const dayData = {
				temperature,
				humidity,
				weatherState,
				wind
		}
		return dayData;
	}

	transformDay = (data) => (
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
                data: this.transformWeatherDay(item),
            }
		))	
    );

	obtainHours(data) {
		let hours = [];
		data.map((item) => {	
            hours.push(item.hour);  
			return hours;
        });
        return hours;
	};

	obtainDataDay(data) {
		let objectDay = [];
		var day = this.getCurrentDate();
		data.map((item) => {
			if(item.weekDay.includes(day)){
				objectDay.push(item);
			}
		});
		return objectDay;
	};
	
	obtainDataTemp(data) {
		let object = [];
		let temp = [];
		data.map((item) => {
			temp.push(item.data.temperature);
			return item;
		});
		object.push({
			label: 'Temperatura',
			backgroundColor: '#F5F5DC',
			borderWidth: 3,
			borderColor: '#BDB76B',
			pointRadius: 4,
			data: temp,
		});
		return object
	};

	obtainDataWind(data) {
		let object = [];
		let wind = [];
		data.map((item) => {
			wind.push(item.data.wind);
			return item;
		});
		object.push({
			label: 'Viento',
			opacity: 0.5,
			backgroundColor: '#A9A9A9',
			borderWidth: 3,
			borderColor: '#696969',
			pointRadius: 4,
			data: wind
		});
		return object
	};

	obtainDataHumidity(data) {
		let object = [];
		let humidity = [];
		data.map((item) => {
			humidity.push(item.data.humidity);
			return item;
		});
		object.push({
			label: 'Humedad',
			data: humidity,
			lineTension: 0.1,
			backgroundColor: 'rgba(75,192,192,0.2)',
			borderWidth: 3,
			borderColor: 'rgba(75,192,192,1)',
			pointRadius: 4
		});
		return object
	};

	componentWillReceiveProps(city) {
		const api_key = "cf6b1fc1c9b7e2f6f5aa59ff2c25c965";
		const url = "http://api.openweathermap.org/data/2.5/forecast";
		const url_forecast = `${url}?q=${city.city}&appid=${api_key}`;

		fetch(url_forecast).then( resolve => {
			return resolve.json();
		}).then(forecastData => {
			let newWeather = this.transformDay(forecastData);
			let weatherDay = this.obtainDataDay(newWeather);
            let dataTemp = {
                labels: this.obtainHours(weatherDay),
				datasets: this.obtainDataTemp(weatherDay)
			};
			let dataWind = {
                labels: this.obtainHours(weatherDay),
				datasets: this.obtainDataWind(weatherDay)
			};
			let dataHumidity = {
                labels: this.obtainHours(weatherDay),
				datasets: this.obtainDataHumidity(weatherDay)
			};
            this.setState({
                forecastData: forecastData,
				dataTemp: dataTemp,
				dataWind: dataWind,
				dataHumidity: dataHumidity
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
			let newWeather = this.transformDay(forecastData);
			let weatherDay = this.obtainDataDay(newWeather);
            let dataTemp = {
                labels: this.obtainHours(weatherDay),
				datasets: this.obtainDataTemp(weatherDay)
			};
			let dataWind = {
                labels: this.obtainHours(weatherDay),
				datasets: this.obtainDataWind(weatherDay)
			};
			let dataHumidity = {
                labels: this.obtainHours(weatherDay),
				datasets: this.obtainDataHumidity(weatherDay)
			};
            this.setState({
                forecastData: forecastData,
				dataTemp: dataTemp,
				dataWind: dataWind,
				dataHumidity: dataHumidity
            });
		});
	}	
	getOptionsBarMax(measureUnitEvo, measureUnit) {
		return {
			responsive: true,
			maintainAspectRatio: true,
				scales: {
					xAxes: [{
						barPercentage: 0.8,
						ticks: {
							fontFamily: 'flamasemibold',
							fontSize: 13,
							fontColor: '#000000',
							userCallback(item) {
								return `${item.toLocaleString()}${measureUnit}   `;
							}
						},
						gridLines: {
								display: false,
								color: '#000000',
								zeroLineColor: '#000000'
						}
					}],
					yAxes: [{
						gridLines: {
							drawBorder: true,
							color: '#DCDCDC',
						},
						ticks: {
							fontFamily: 'flamasemibold',
							fontSize: 13,
							fontColor: '#000000',
							beginAtZero: true,
							userCallback(item) {
								return `${item.toLocaleString()} ${measureUnitEvo}   `;
							}
						}
					}]
				},
			legend: {
				display: false
			}
		};
	}

	getOptionsHorizontalBarMax(measureUnitEvo, measureUnit) {
		return {
			responsive: true,
			maintainAspectRatio: true,
				scales: {
					xAxes: [{
						gridLines: {
							drawBorder: false,
							color: '#DCDCDC'
						},
						ticks: {
							fontFamily: 'flamasemibold',
							fontSize: 13,
							fontColor: '#000000',
							beginAtZero: true,
							userCallback(item) {
								return `${item.toLocaleString()} ${measureUnitEvo}      `;
							}
						}
						
					}],
					yAxes: [{
						barPercentage: 0.8,
						ticks: {
							fontFamily: 'flamasemibold',
							fontSize: 13,
							fontColor: '#000000',
							userCallback(item) {
								return `${item.toLocaleString()}${measureUnit}      `;
							}
						},
						gridLines: {
								display: false,
								color: '#000000',
								zeroLineColor: '#000000'
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
				<div style={{ marginLeft: '50%'}}>
					<h3 style={{textAlign: "center"}}>
						Humedad
					</h3>
        		</div>
                <div style={{ marginLeft: '50%', height: 'auto', width:'50%' }} id={'tooltip-Point-wrapper'}>
					<Line
						id={'chart-Point'}
						width="800"
						height="350"
						data={this.state.dataHumidity}
						options={this.getOptionsBarMax('%',':00')}
					/>	
				</div>

				<div  style={{ marginTop: '-24.3%'}}>
					<h3 style={{marginLeft: "17%"}}>
						Temperatura diaria
					</h3>
        		</div>
                <div style={{ height: 'auto', width:'50%' }} id={'tooltip-Point-wrapper'}>
					<Bar
						id={'chart-Point'}
                        width="800"
                        height="350"
                        data={this.state.dataTemp}
                        options={this.getOptionsBarMax('℃', ':00')}
                    />
				</div>

				<div>
					<h3 style={{textAlign: "center"}}>
						Viento
					</h3>
        		</div>
                <div style={{ marginLeft: '25%', height: 'auto', width:'50%' }} id={'tooltip-Point-wrapper'}>
					<HorizontalBar
						id={'chart-Point'}
						width="800"
						height="350"
						data={this.state.dataWind}
						options={this.getOptionsHorizontalBarMax('km/h', ':00')}
					/>
                </div>	
				<br></br>
				<br></br>
				

			</div>
		);
	}	
}