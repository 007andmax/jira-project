export class UserNoteValidate {
    email: boolean = true;
    reEmail = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/;

    /**
* @description Return value of "email"
* @returns {boolean} This is the result
*/
    public getEmail() {
        return this.email;
    }

    public resetEmail() {
        this.email = true;
    }

    public checkEmail(email) {
        if (!email || !email.match(this.reEmail)) {
            this.email = false;
        } else {
            this.email = true;
        }

    }
}