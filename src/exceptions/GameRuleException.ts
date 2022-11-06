export class GameRuleException extends Error {
    public name: string;
    public status: number;
    public type: string;
    public message: string;
  
    constructor(status: number, type: string, message: string) {
      super(message);
      this.name = 'error';
      this.status = status;
      this.type = type;
      this.message = message;
    }
  }
  