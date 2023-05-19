import { LightningElement, wire } from "lwc";
import { getRecord } from "lightning/uiRecordApi";
import { subscribe, unsubscribe, MessageContext } from "lightning/messageService";
import { NavigationMixin } from 'lightning/navigation';
import SELECTED_STUDENT_CHANNEL from "@salesforce/messageChannel/SelectedStudentChannel__c";
import Utils from 'c/utils';

// TODO #1: import the getRecord, getFieldValue, and getFieldDisplayValue functions from lightning/uiRecordApi.
import FIELD_Name from "@salesforce/schema/Contact.Name";
import FIELD_Description from "@salesforce/schema/Contact.Description";
import FIELD_Email from "@salesforce/schema/Contact.Email";
import FIELD_Phone from "@salesforce/schema/Contact.Phone";

// TODO #2: We've imported the name field and placed it into an array for you.
//          To prepare for Lab 1, import the Description, Email, and Phone fields and add them to the array.

const fields = [FIELD_Name, FIELD_Description, FIELD_Email, FIELD_Phone];

export default class StudentDetail extends NavigationMixin(LightningElement) {
	Subscription;
	// TODO #3: locate a valid Contact ID in your scratch org and store it in the studentId property.
	// Example: studentId = '003S000001SBAXEIA5';
	studentId;

	@wire(MessageContext) messageContext;
	//TODO #4: use wire service to call getRecord, passing in our studentId and array of fields.
	//		   Store the result in a property named wiredStudent.
	@wire(getRecord, { recordId: "$studentId", fields })
	wiredStudent;

	get name() {
		return Utils.getDisplayValue(this.wiredStudent.data, FIELD_Name);
	}

	get description() {
		return Utils.getDisplayValue(this.wiredStudent.data, FIELD_Description);
	}

	get phone() {
		return Utils.getDisplayValue(this.wiredStudent.data, FIELD_Phone);
	}
	get email() {
		return Utils.getDisplayValue(this.wiredStudent.data, FIELD_Email);
	}

	//TODO #5: We provided a getter for the name field.
	// 		   To prepare for Lab 1, create getters for the description, phone, and email fields.

	//TODO #6: Review the cardTitle getter, and the _getDisplayValue function below.

	get cardTitle() {
		let title = "Please select a student";
		if (this.wiredStudent.data) {
			title = this.name;
		} else if (this.wiredStudent.error) {
			title = "Something went wrong...";
		}
		return title;
	}

	/*_getDisplayValue(data, field) {
		return getFieldDisplayValue(data, field) ? getFieldDisplayValue(data, field) : getFieldValue(data, field);
	}*/

	navigateToButton() {
		this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
				recordId: this.studentId,
                objectApiName: 'Contact', // objectApiName is optional
                actionName: 'view',
            },
        });
	}

	handleStudentChange(message) {
		this.studentId = message.studentId;
	}

	connectedCallback() {
		if (this.subscription) {
			return;
		}
		this.subscription = subscribe(this.messageContext, SELECTED_STUDENT_CHANNEL, (message) => {
			this.handleStudentChange(message);
		});
	}

	disconnectedCallback() {
		unsubscribe(this.subscription);
		this.subscription = null;
	}
}
