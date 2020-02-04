export class GlNumberItem {
    glNumber: string;
    description: string;
    sum:Array<number> = [];
    total: number = 0;
    constructor(glNumber, description,len) {
        this.glNumber = glNumber;
        this.description = description;
        if (len)
        {
            this.sum = new Array(len);
            for(let i=0;i<this.sum.length;i++)
            {
                this.sum[i] = 0;
            }
        }
      
      
      
    }
    public getTotal() {
        return this.total;
    }
    public setSum (i,sum) {
        this.sum[i] =sum;
    }
    public updateTotal(sum) {
        this.total += sum;
    }
    public addSub(data) {
        this.sum.push(data);
    }
    public getSumList() {
        return this.sum;
    }
}