import {mutate} from "swr";
import Link from "next/link";
import React, {useState, useEffect} from "react";
import moment from "moment";

import { c } from "../../config/colors";
import Button from "../button";
import Modal from "../modal";






const ViewCard = ({view}) => {
	const {view_name, created_at, updated_at, config, ...viewdata} = view;
	// belangrijk om alle niet-JSON hierboven weg te filteren
	const [compact, setCompact] = useState(0);
	const [hidden, setHidden] = useState(0);
	const [expanded, setExpanded] = useState(0);
	const [undef, setUndef] = useState(0);
	const [deleting, setDeleting] = useState(false);
	const [verify, setVerify] = useState(false);

	useEffect(() => {
		let compact_counter = 0;
		let hidden_counter = 0;
		let expanded_counter = 0;
		let undef_counter = 0;

		Object.values(viewdata).forEach(val => {
			const json = JSON.parse(val);
			if (json !== null && json.display) {
				switch (json.display) {
				case "hidden":
					hidden_counter++;
					break;
				case "compact":
					compact_counter++;
					break;
				case "expanded":
					expanded_counter++;
					break;
				default:
					undef_counter++;
					break;
				}
			} else {
				undef_counter++;
			}
		}, []);
		setHidden(hidden_counter);
		setCompact(compact_counter);
		setExpanded(expanded_counter);
		setUndef(undef_counter);
	});

	async function deleteEntry() {
		setDeleting(true);
		let res = await fetch(`/api/delete-view?view_name=${view_name}`, { method: "DELETE" });
		let json = await res.json();
		if (!res.ok) throw Error(json.message);
		mutate("/api/get-views");
		setDeleting(false);
	}

	return (
		<div className="card">
			<div className="head">
				<h4>{view_name}</h4>
			</div>
			<div className="body">
				<p><b>Initiële kolommen: </b>{compact}</p>
				<p><b>Uitklapbare kolommen: </b>{expanded}</p>
				<p><b>Verborgen kolommen: </b>{hidden}</p>
				<p><b>Ongedefinieerde kolommen: </b>{undef}</p>
				<br/>
				<p><i>View aangemaakt: </i>{moment(created_at).locale("nl").format("LLL")}</p>
				<p><i>View laatst aangepast: </i>{moment(updated_at).locale("nl").format("LLL")}</p>
				<br/>
				<br/>
				<div className="button-container">
					<Link href={`/view-manager/${view_name}`}>
						<div>
							<Button style={{fontSize: "0.9em"}}>Bekijken</Button>
						</div>
					</Link>
					<Link href={`/view-manager/${view_name}?v=edit`}>
						<div>
							<Button style={{fontSize: "0.9em"}}>Aanpassen</Button>
						</div>
					</Link>

					<Button onClick={() => setVerify(true)} disabled={deleting} style={{fontSize: "0.9em"}}>Verwijderen</Button>


				</div>
			</div>
			{verify &&
				<Modal header={"Weet je het zeker?"}>
					Weet je zeker dat je {view_name} wilt verwijderen?
					<br/>
					<div className={"modal-button-container"}>
						<Button onClick={() => setVerify(false)} style={{fontSize: "0.9em", marginRight: "7px"}}>Annuleren</Button>
						<Button onClick={deleteEntry} style={{fontSize: "0.9em"}}>Verwijderen</Button>
					</div>
				</Modal>}
			<style jsx>{`
        .card{
          width: 300px;
          padding: 20px;
        }
        .head{
          background-color: ${c.primary.color};
          color: ${c.primary.text};
          text-align: left;
        }
        .head>h4{
          margin: 0;
          padding: 7px 0 7px 14px;
        }
        .body{
          background-color: white;
          color: black;
          padding: 14px;
          font-size: 0.8em;
          text-align: right;
        }
        .body>p{
          margin: 0
        }
        b, i{
          float: left;
        }
        .button-container{
          display: flex;
          justify-content: space-between;
        }
				.modal-button-container{
					margin-top: 14px;
					text-align: right;
				}

      `}</style>
		</div>
	);
};


export default ViewCard;
